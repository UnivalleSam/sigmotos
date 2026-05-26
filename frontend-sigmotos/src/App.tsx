import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SigmotosAuth from "./pages/Auth/SigmotosAuth";
import Booking from "./pages/Booking/booking";
import MaintenanceStatus from "./pages/Maintenance/MaintenanceStatus";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserProfile from "./pages/Profile/UserProfile";
import MyMotos from "./pages/MyMotos/MyMotos";
import ServiceHistory from "./pages/History/ServiceHistory";

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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/my-motos" element={<MyMotos />} />
        <Route path="/history" element={<ServiceHistory />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;