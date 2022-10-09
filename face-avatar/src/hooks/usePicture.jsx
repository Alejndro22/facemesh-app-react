import { useContext } from "react";
import PictureContext from "../context/PictureProvider";

const usePicture = () => {
  return useContext(PictureContext);
};

export default usePicture;
