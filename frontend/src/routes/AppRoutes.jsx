import { Routes, Route, Navigate } from "react-router-dom";
import VarifyOtp from "../pages/auth/varify-otp";
import CustomerDashboard from "../pages/traveller/dashboard";
import Navbar from "../components/navbar";
import CustomerSignup from "../pages/auth/traveller-signup";
import CustomerLoginPage from "../pages/auth/traveller-login";
import AdminLogin from "../pages/auth/admin-login";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import GuideManagement from "../pages/admin/GuideManagement";
import GuideSignup from "../pages/guide/guide-signup";
import GuideLogin from "../pages/guide/guide-login";
import GuideDashboard from "../pages/guide/guide-dashboard";
import KycManagement from "../pages/admin/KycManagement";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute, PublicRoute, ProtectedGuideRoute } from "../components/ProtectedRoutes/ProtectedRoute";

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes - No Navbar */}
      <Route path="/traveller/login" element={<CustomerLoginPage />} />
      <Route path="/traveller/signup" element={<CustomerSignup />} />
      <Route path="/traveller/varify/otp" element={<VarifyOtp />} />
      <Route path="/guide/signup" element={<GuideSignup />} />
      <Route path="/guide/login" element={<GuideLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedAdminRoute>
            <UserManagement />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/guides"
        element={
          <ProtectedAdminRoute>
            <GuideManagement />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/kyc"
        element={
          <ProtectedAdminRoute>
            <KycManagement />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/communication"
        element={
          <ProtectedAdminRoute>
            <div className="coming-soon">Coming Soon - Communication Management</div>
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedAdminRoute>
            <div className="coming-soon">Coming Soon - Reviews Management</div>
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/web"
        element={
          <ProtectedAdminRoute>
            <div className="coming-soon">Coming Soon - Web Management</div>
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedAdminRoute>
            <div className="coming-soon">Coming Soon - Report Management</div>
          </ProtectedAdminRoute>
        }
      />

      {/* Protected routes with Navbar - Protected Routes */}
      <Route
        path="/traveller/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Guide Dashboard Route */}
      <Route
        path="/guide/dashboard"
        element={
          <ProtectedGuideRoute>
            <GuideDashboard />
          </ProtectedGuideRoute>
        }
      />

      {/* Public Route - Home Page (accessible only before login) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Navbar />
            <CustomerDashboard />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
