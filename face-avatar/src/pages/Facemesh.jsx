import React, { useEffect } from "react";
import usePicture from "../hooks/usePicture";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-core";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import { useRef } from "react";
import { drawMesh } from "../utilities";

export const Facemesh = () => {
  const { picture, pictureMesh, setPictureMesh } = usePicture();
  const canvasRef = useRef(null);
  const img1 = new Image(); // Image constructor
  img1.src = picture;
  img1.height = 400;
  img1.width = 400;

  //cargar el facemesh
  const detect = async (image) => {
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
  };

  detect(img1);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          height: 400,
          width: 400,
        }}
      ></canvas>
    </div>
  );
};
