import { useState, createContext } from "react";

const PictureContext = createContext();

const PictureProvider = ({ children }) => {
  const [picture, setPicture] = useState("");
  const [pictureMesh, setPictureMesh] = useState("");

  return (
    <PictureContext.Provider
      value={{ picture, setPicture, pictureMesh, setPictureMesh }}
    >
      {children}
    </PictureContext.Provider>
  );
};

export { PictureProvider };

export default PictureContext;
