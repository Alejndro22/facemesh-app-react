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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/client";

export const Facemesh = () => {
  const { picture, pictureMesh, setPictureMesh } = usePicture();
  const [loading, setLoading] = useState(false);
  let [ctx, setCtx] = useState();
  let [ctx2, setCtx2] = useState();
  let [ctx3, setCtx3] = useState();
  let [urlEyes, setUrlEyes] = useState("");
  let [urlFace, setUrlFace] = useState("");
  let [eyeShape, setEyeShape] = useState("");
  let [mouthShape, setMouthShape] = useState("");
  let [faceShape, setFaceShape] = useState("");
  const canvasRef = useRef();
  const canvasUploadRef = useRef();
  const canvasUploadRefEyes = useRef();
  var today = new Date();

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
  const detect = async (image, ctx, ctxFirebase, ctxFirebaseEyes) => {
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
    const eyesCoords = calc_eyes_box(faces[0].keypoints);
    const mouthCoords = calc_mouth_box(faces[0].keypoints);
    cropImg(
      ctxFirebase,
      faces[0].box.xMin,
      faces[0].box.yMin,
      faces[0].box.width,
      faces[0].box.height
    );

    cropEyes(
      ctxFirebaseEyes,
      eyesCoords[1],
      eyesCoords[3],
      eyesCoords[0] - eyesCoords[1],
      eyesCoords[2] - eyesCoords[3]
    );

    getDetectionType();

    //      DRAW RECTANGLE FOR WHOLE FACE
    // ctx.rect(
    //   faces[0].box.xMin,
    //   faces[0].box.yMin,
    //   faces[0].box.width,
    //   faces[0].box.height
    // );
    var imageObj1 = new Image();
    imageObj1.src = "Assets/Cuadrada/cuadrada-tez1.png";
    imageObj1.onload = function () {
      ctx.drawImage(
        imageObj1,
        faces[0].box.xMin,
        faces[0].box.yMin,
        faces[0].box.width,
        faces[0].box.height
      );
    };

    //      DRAW RECTANGLE FOR EYES
    // ctx.rect(
    //   eyesCoords[1],
    //   eyesCoords[3],
    //   eyesCoords[0] - eyesCoords[1],
    //   eyesCoords[2] - eyesCoords[3]
    // );
    var imageObj2 = new Image();
    imageObj2.src = "Assets/Ojos/ojo-redondos.png";
    imageObj2.onload = function () {
      ctx.drawImage(
        imageObj2,
        eyesCoords[1],
        eyesCoords[3],
        eyesCoords[0] - eyesCoords[1],
        eyesCoords[2] - eyesCoords[3]
      );
    };

    //      DRAW RECTANGLE FOR MOUTH
    // ctx.rect(
    //   mouthCoords[1],
    //   mouthCoords[3],
    //   mouthCoords[0] - mouthCoords[1],
    //   mouthCoords[2] - mouthCoords[3]
    // );
    var imageObj3 = new Image();
    imageObj3.src = "Assets/Bocas/sonrisa cerrada.png";
    imageObj3.onload = function () {
      ctx.drawImage(
        imageObj3,
        mouthCoords[1],
        mouthCoords[3],
        mouthCoords[0] - mouthCoords[1],
        mouthCoords[2] - mouthCoords[3]
      );
    };

    ctx.stroke();
    setLoading(false);
  };

  const cropImg = async (ctxFirebase, sx, sy, sWidth, sHeight) => {
    await ctxFirebase.drawImage(img1, sx, sy, sWidth, sHeight, 0, 0, 64, 64);
    canvasUploadRef.current.toBlob((blob) => {
      uploadImage(blob, "face");
    }, "image/jpeg");
  };

  const cropEyes = (ctxFirebaseEyes, sx, sy, sWidth, sHeight) => {
    ctxFirebaseEyes.drawImage(img1, sx, sy, sWidth, sHeight, 0, 0, 64, 32);
    canvasUploadRefEyes.current.toBlob((blob) => {
      uploadImage(blob, "eyes");
    }, "image/jpeg");
  };

  const uploadImage = async (blob, type) => {
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();
    const storageRef = ref(storage, `models/${type}/${date}.jpg`);
    await uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file! type: " + type);
      if (type === "face") {
        getDownloadURL(snapshot.ref).then((url) => setUrlFace(url));
      } else {
        getDownloadURL(snapshot.ref).then((url) => setUrlEyes(url));
      }
    });
  };

  const getDetectionType = async () => {
    try {
      const message = await fetch(
        "https://portcrg-dev.onrender.com/api/courses/unassign",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          body: {
            url1: urlFace,
            url2: urlEyes,
          },
        }
      ).then(function (response) {
        setEyeShape(response.body.face);
        console.log(response.body.face);
        setMouthShape(response.body.smile);
        console.log(response.body.smile);
        setFaceShape(response.body.face);
        console.log(response.body.face);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    canvasRef.current.width = 400;
    canvasRef.current.height = 400;
    ctx = canvasRef.current.getContext("2d");

    canvasUploadRef.current.width = 64;
    canvasUploadRef.current.height = 64;
    ctx2 = canvasUploadRef.current.getContext("2d");

    canvasUploadRefEyes.current.width = 64;
    canvasUploadRefEyes.current.height = 32;
    ctx3 = canvasUploadRefEyes.current.getContext("2d");
    detect(img1, ctx, ctx2, ctx3);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <img
          className=""
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
      <div>
        <canvas
          ref={canvasUploadRef}
          className=""
          style={{
            height: 64,
            width: 64,
          }}
        ></canvas>
        <canvas
          ref={canvasUploadRefEyes}
          className=""
          style={{
            height: 32,
            width: 64,
          }}
        ></canvas>
      </div>
    </div>
  );
};
