import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SigmotosAuth from "./pages/Auth/SigmotosAuth";
import Booking from "./pages/Booking/booking";
import MaintenanceStatus from "./pages/Maintenance/MaintenanceStatus";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<SigmotosAuth />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/maintenance" element={<MaintenanceStatus />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;