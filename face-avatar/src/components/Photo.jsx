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
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mt-4">Fase inicial: Tomar foto</h1>
      <div className="flex flex-row justify-center w-full">
        <div className="w-full">
          <div className="flex items-center py-4">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 text-gray-400">Centra tu rostro :D</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
        </div>
      </div>
      <div>
        {picture == "" ? (
          <Webcam
            audio={false}
            mirrored={true}
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
            className="text-white bg-gradient-to-br mt-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={(e) => {
              e.preventDefault();
              setPicture("");
            }}
          >
            Volver a tomar
          </button>
        ) : (
          <button
            className="text-white bg-gradient-to-br mt-2 from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
