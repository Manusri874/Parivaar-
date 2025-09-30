import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MemberProfile from "./pages/MemberProfile";
import MedicalSummarizer from "./pages/MedicalSummarizer"; // ✅ New page
import EmergencyDoctorView from "./components/emergency/EmergencyDoctorView";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/:memberId"
        element={
          <ProtectedRoute>
            <MemberProfile />
          </ProtectedRoute>
        }
      />

      {/* ✅ Medical Summarizer Page */}
      <Route
        path="/medical-summarizer/:memberId"
        element={
          <ProtectedRoute>
            <MedicalSummarizer />
          </ProtectedRoute>
        }
      />

      {/* ✅ Public doctor-only route (using UUID) */}
      <Route path="/doctor-view/:uuid" element={<EmergencyDoctorView />} />

      {/* Fallback for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
