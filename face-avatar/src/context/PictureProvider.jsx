import { useState, createContext } from "react";

const PictureContext = createContext();

const PictureProvider = ({ children }) => {
  const [picture, setPicture] = useState("");

  return (
    <PictureContext.Provider value={{ picture, setPicture }}>
      {children}
    </PictureContext.Provider>
  );
};

export { PictureProvider };

export default PictureContext;
