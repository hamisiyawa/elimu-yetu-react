import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastHandler from "./components/common/ToastHandler";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Materials from "./pages/Materials";
import Support from "./pages/Support";
import Otp from "./pages/Otp";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ManageMaterials from "./pages/dashboard/ManageMaterials";
import Settings from "./pages/dashboard/Settings";
import AdminApprovals from "./pages/dashboard/AdminApprovals";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* Toast container goes here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />
      {/* Global toast listener */}
      <ToastHandler />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/support" element={<Support />} />

        // Protected dashboard routes for teachers and admins only
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
          <DashboardLayout />
          </ProtectedRoute>}>
          <Route index element={<DashboardHome />} />

          <Route path="manage-materials" element={
            <ProtectedRoute allowedRoles={"teacher"}>
               <ManageMaterials />
            </ProtectedRoute>
          } />

          <Route path="approvals" element={
            <ProtectedRoute allowedRoles={"admin"}>
               <AdminApprovals />
            </ProtectedRoute>
          } />

          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;