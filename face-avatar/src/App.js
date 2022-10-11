import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PictureProvider } from "./context/PictureProvider";
import { Main } from "./pages/Main";
import { Facemesh } from "./pages/Facemesh";

function App() {
  return (
    <BrowserRouter>
      <PictureProvider>
        <Routes>
          <Route path="/">
            <Route index element={<Main />} />
            <Route path="facemesh" element={<Facemesh />} />
          </Route>
        </Routes>
      </PictureProvider>
    </BrowserRouter>
  );
}

export default App;
