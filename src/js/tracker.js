import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/+esm";

const videoElement = document.getElementById('webcam');
const canvasElement = document.querySelector('.output_canvas');
const canvasCtx = canvasElement ? canvasElement.getContext('2d') : null;

let handLandmarker = undefined;

// 1. Initialize MediaPipe Hand Landmarker
async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });
  console.log("HandLandmarker initialized successfully.");
  startWebcam();
}
createHandLandmarker();

// 2. Start Webcam Feed
function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.addEventListener("loadeddata", predictWebcam);
    })
    .catch((err) => {
      console.error("Error accessing webcam:", err);
    });
}

// 3. Main Real-Time Prediction & Drawing Loop
let lastVideoTime = -1;
async function predictWebcam() {
  if (!handLandmarker || !canvasCtx) return;

  let startTimeMs = performance.now();
  if (videoElement.currentTime !== lastVideoTime) {
    lastVideoTime = videoElement.currentTime;
    
    // Run Hand Landmarker detection
    const results = handLandmarker.detectForVideo(videoElement, startTimeMs);

    // DRAW THE WEBCAM FEED TO THE CANVAS
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Process detected hands and gestures
    if (results.landmarks && results.landmarks.length > 0) {
      for (let i = 0; i < results.landmarks.length; i++) {
        const landmarks = results.landmarks[i];
        const handedness = results.handedness[i][0].categoryName; // "Left" or "Right"

        processHandGestures(landmarks, handedness);
      }
    }
    canvasCtx.restore();
  }
  
  window.requestAnimationFrame(predictWebcam);
}

// 4. Gesture Evaluation Logic
// Keep track of the last detected gesture for each hand to prevent console spam
const lastGestures = {
  Left: null,
  Right: null
};

function processHandGestures(landmarks, handedness) {
  let detectedGesture = "None";

  if (isOpenPalm(landmarks)) {
    detectedGesture = "Select Object (Open Palm)";
  } 
  else if (isPointerAndThumbExtended(landmarks)) {
    detectedGesture = "Move Object (Pointer & Thumb)";
  }

  // ONLY log when the gesture changes
  if (detectedGesture !== lastGestures[handedness]) {
    if (detectedGesture !== "None") {
      console.log(`${handedness} Hand detected: ${detectedGesture}`);
    } else {
      console.log(`${handedness} Hand: Released / Idle`);
    }
    lastGestures[handedness] = detectedGesture;
  }
}
// Helper: 3D Euclidean Distance
function getDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
    Math.pow(p1.y - p2.y, 2) +
    Math.pow(p1.z - p2.z, 2)
  );
}

// Helper: Check if finger is extended
function isFingerExtended(landmarks, tipIndex, pipIndex) {
  const wrist = landmarks[0];
  return getDistance(landmarks[tipIndex], wrist) > getDistance(landmarks[pipIndex], wrist);
}

// Gesture 1: Open Palm (All fingers extended)
function isOpenPalm(landmarks) {
  const thumbExtended = isFingerExtended(landmarks, 4, 2);
  const indexExtended = isFingerExtended(landmarks, 8, 6);
  const middleExtended = isFingerExtended(landmarks, 12, 10);
  const ringExtended = isFingerExtended(landmarks, 16, 14);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18);

  return thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended;
}

// Gesture 2: Pointer & Thumb Extended, others curled
function isPointerAndThumbExtended(landmarks) {
  const thumbExtended = isFingerExtended(landmarks, 4, 2);
  const indexExtended = isFingerExtended(landmarks, 8, 6);

  const middleCurled = !isFingerExtended(landmarks, 12, 10);
  const ringCurled = !isFingerExtended(landmarks, 16, 14);
  const pinkyCurled = !isFingerExtended(landmarks, 20, 18);

  return thumbExtended && indexExtended && middleCurled && ringCurled && pinkyCurled;
}

function isDragObject() {
  //pointer finger and thumb extended; middle, index, pinky closed position 
  pass
}

function isRotateObject() {
  //pointer finger and thumb extended; middle, index, pinky closed position 
  // the angle of left and right pointer and thumb fingers change if we want to rotate a selected object
  pass
}

function isResizeObject() {
  //pointer finger and thumb extended; middle, index, pinky closed position 
  //the distance between left and right pointer and thumb fingers gets smaller if we want to make an object smaller 
  // the distance between left and right pointer and thumb gets bigger if we want to make an object bigger
  pass
}

//function that runs at the background all the time to check fatigue of a prticipant during an experiment 
function fatigueScale() {
  // if participant lowers hands (the vertical path of a wrist is lower compared to the start of the experiment) then fatigue += 1
  // else observe participant, fatuigue doesn't change 
}

//boolean ds that tracks fingers 
//and angke of thumb is correct - distance between fingertips 
//taylor what happens depending on experiment condition 
//enum value to changr logic   of experiment 
//recogniseer class
//survey for angency for sominant/non hand (nasa-tlx, liker scale), 2-3 custom question (fatigue)
//task time, accuracy 
//lit review START (creative writing what each work tells us)

/* FUNCTIONS FOR ASSYMETRIC INPUT */