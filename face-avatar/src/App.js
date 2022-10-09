import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PictureProvider } from "./context/PictureProvider";
import * as tf from "@tensorflow/tfjs";
import * as facelandmarks from "@tensorflow-models/face-landmarks-detection";
import { Main } from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <PictureProvider>
        <Routes>
          <Route path="/">
            <Route index element={<Main />} />
          </Route>
        </Routes>
      </PictureProvider>
    </BrowserRouter>
  );
}

export default App;
