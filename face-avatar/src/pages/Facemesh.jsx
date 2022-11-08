import React, { useEffect, useState } from "react";
import usePicture from "../hooks/usePicture";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-core";
// Register WebGL backend.
// import "@tensorflow/tfjs-backend-webgl";

import "@mediapipe/face_mesh";
import { useRef } from "react";
import { drawMesh } from "../utilities";

export const Facemesh = () => {
  const { picture, pictureMesh, setPictureMesh } = usePicture();
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef();
  const img1 = new Image(); // Image constructor
  img1.src = picture;
  img1.height = 400;
  img1.width = 400;

  const eyesKeypoints = [
    247, 30, 29, 27, 28, 56, 190, 130, 25, 110, 24, 23, 22, 26, 112, 243, 467,
    260, 259, 257, 258, 286, 414, 359, 255, 339, 254, 253, 252, 256, 341, 463,
  ];

  const mouthKeypoints = [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181, 84, 17, 314,
    405, 321, 375, 291,
  ];

  const calc_eyes_box = (points) => {
    let maxX, maxY, minX, minY;
    let xCoordinates = [];
    let yCoordinates = [];
    for (let index = 0; index < eyesKeypoints.length; index++) {
      xCoordinates.push(points[eyesKeypoints[index]].x);
      yCoordinates.push(points[eyesKeypoints[index]].y);
    }
    maxX = Math.max.apply(Math, xCoordinates);
    minX = Math.min.apply(Math, xCoordinates);
    maxY = Math.max.apply(Math, yCoordinates);
    minY = Math.min.apply(Math, yCoordinates);
    return [maxX, minX, maxY, minY];
  };

  const calc_mouth_box = (points) => {
    let maxX, maxY, minX, minY;
    let xCoordinates = [];
    let yCoordinates = [];
    for (let index = 0; index < mouthKeypoints.length; index++) {
      xCoordinates.push(points[mouthKeypoints[index]].x);
      yCoordinates.push(points[mouthKeypoints[index]].y);
    }
    maxX = Math.max.apply(Math, xCoordinates);
    minX = Math.min.apply(Math, xCoordinates);
    maxY = Math.max.apply(Math, yCoordinates);
    minY = Math.min.apply(Math, yCoordinates);
    return [maxX, minX, maxY, minY];
  };

  //cargar el facemesh
  const detect = async (image, ctx) => {
    setLoading(true);
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
    };
    const detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
    const faces = await detector.estimateFaces(image);

    console.log(faces);
    detectEyesShape();
    // canvasRef.current.width = 400;
    // canvasRef.current.height = 400;
    const eyesCoords = calc_eyes_box(faces[0].keypoints);
    const mouthCoords = calc_mouth_box(faces[0].keypoints);
    // const ctx = canvasRef.current.getContext("2d");
    //      DRAW RECTANGLE FOR WHOLE FACE
    ctx.rect(
      faces[0].box.xMin,
      faces[0].box.yMin,
      faces[0].box.width,
      faces[0].box.height
    );
    //      DRAW RECTANGLE FOR EYES
    ctx.rect(
      eyesCoords[1],
      eyesCoords[3],
      eyesCoords[0] - eyesCoords[1],
      eyesCoords[2] - eyesCoords[3]
    );
    //      DRAW RECTANGLE FOR MOUTH
    ctx.rect(
      mouthCoords[1],
      mouthCoords[3],
      mouthCoords[0] - mouthCoords[1],
      mouthCoords[2] - mouthCoords[3]
    );
    ctx.stroke();
    setLoading(false);
  };

  const detectEyesShape = async () => {
    const model = await tf.loadLayersModel(
      "https://firebasestorage.googleapis.com/v0/b/impulso-buzzer-beaters.appspot.com/o/models%2Fmodel.json?alt=media&token=7334c2a1-7621-4023-bf59-e15ba689ce3b"
    );
    const example = tf.FromPixels(picture); // for example
    const prediction = model.predict(example);
    console.log(prediction);
  };

  useEffect(() => {
    canvasRef.current.width = 400;
    canvasRef.current.height = 400;
    const ctx = canvasRef.current.getContext("2d");
    detect(img1, ctx);
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <img
          src={picture}
          alt="imagen del contexto"
          style={{
            position: "absolute",
            height: 400,
            width: 400,
          }}
        ></img>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          height: 400,
          width: 400,
        }}
      ></canvas>
      <div></div>
    </div>
  );
};
