import { Routes, Route } from "react-router-dom";
import VarifyOtp from "../pages/auth/varify-otp";
import CustomerDashboard from "../pages/traveller/dashboard";
import Navbar from "../components/navbar";
import CustomerSignup from "../pages/auth/traveller-signup";
import CustomerLoginPage from "../pages/auth/traveller-login";
import AdminLogin from "../pages/auth/admin-login";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes - No Navbar */}
      <Route path="/traveller/login" element={<CustomerLoginPage />} />
      <Route path="/traveller/signup" element={<CustomerSignup />} />
      <Route path="/traveller/varify/otp" element={<VarifyOtp />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected routes with Navbar */}
      <Route
        path="/traveller/dashboard"
        element={
          <>
            <Navbar />
            <CustomerDashboard />
          </>
        }
      />
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <CustomerDashboard />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
