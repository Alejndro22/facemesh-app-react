import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PictureProvider } from "./context/PictureProvider";
import { Main } from "./pages/Main";
import { Facemesh } from "./pages/Facemesh";
import Layout from "./components/Layout/layout";
import TakePic from "./pages/TakePic";

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <PictureProvider>
          <Routes>
            <Route path="/">
              <Route index element={<Main />} />
              <Route path="facemesh" element={<Facemesh />} />
              <Route path="takepic" element={<TakePic />} />
            </Route>
          </Routes>
        </PictureProvider>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
