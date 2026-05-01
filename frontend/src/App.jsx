import {
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import MyEnrollments from "./pages/MyEnrollments";
import AdminPanel from "./pages/AdminPanel";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-enrollments"
        element={
          <ProtectedRoute>
            <MyEnrollments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;