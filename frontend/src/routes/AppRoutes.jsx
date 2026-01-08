import { Routes, Route } from "react-router-dom";
import VarifyOtp from "../pages/auth/varify-otp";
import CustomerDashboard from "../pages/traveller/dashboard";
import Navbar from "../components/navbar";
import CustomerSignup from "../pages/auth/traveller-signup";
import CustomerLoginPage from "../pages/auth/traveller-login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/customerLogin" element={<CustomerLoginPage />} />
      <Route path="/customerSignup" element={<CustomerSignup />} />
      <Route path="/varifyOtp" element={<VarifyOtp />} />

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
