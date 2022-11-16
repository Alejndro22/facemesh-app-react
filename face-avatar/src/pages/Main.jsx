import React from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import Photo from "../components/Photo";
import usePicture from "../hooks/usePicture";

export const Main = () => {
  const newTo = {
    pathname: "/takepic",
  };
  return (
    <div className="App flex flex-col justify-center items-center">
      <div className="">
        <Carousel />
      </div>
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
        <Link className="font-bold text-2xl" to={newTo}>
          CREA TU AVATAR
        </Link>
      </span>
    </div>
  );
};
