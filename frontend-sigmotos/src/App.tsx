import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SigmotosAuth from "./pages/Auth/SigmotosAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SigmotosAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;