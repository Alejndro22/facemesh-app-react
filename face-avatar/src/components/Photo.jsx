import React, { useRef, useCallback } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";
import usePicture from "../hooks/usePicture";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const Photo = () => {
  const { picture, setPicture } = usePicture();
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  });

  return (
    <div>
      <h2>Fase inicial: Tomar foto</h2>
      <div>
        {picture == "" ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != "" ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setPicture("");
            }}
          >
            Volver a tomar
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
          >
            Tomar
          </button>
        )}
      </div>
    </div>
  );
};

export default Photo;
