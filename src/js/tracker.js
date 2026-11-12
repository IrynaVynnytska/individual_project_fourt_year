const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let handLandmarker = undefined;

async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2 // Ideal for bimanual tracking
  });
}

/* FUNCTIONS FOR SYMMETRIC INPUT */

//To detect a custom gesture (e.g., a "Pinch" or an "Open Palm"),
// write helper functions that check the Euclidean distance or vertical positions of specific landmarks.
function getDistance(p1, p2) {
  pass
}

//Ask Euan about how many ifngers need to check for gestures?
function isPointerFingerExtended() {
  pass
}

function isAllFingersExtended() {
  pass
}

function isSelectObject(landmark) {
  //all fingers have to be extended (open palm)
  //should this function 
  // get a value for a wrist position in space to compare if there is any fatigue or not
  pass
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