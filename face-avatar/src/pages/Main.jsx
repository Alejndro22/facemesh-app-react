import React from "react";
import { Link } from "react-router-dom";
import Photo from "../components/Photo";
import usePicture from "../hooks/usePicture";

export const Main = () => {
  const { picture } = usePicture();
  const newTo = {
    pathname: "/facemesh",
    pic: picture,
  };
  return (
    <div className="App">
      <Photo />
      <button onClick={() => {}}>
        <Link to={newTo}>Home</Link>
      </button>
    </div>
  );
};
