import { ReactNode } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import App from "../App";
import Layout from "../components/layout";
import { useAuth } from "../context/auth";
import AnnotationPage from "../pages/annotation";
import ForgotPassword from "../pages/forgotPassword";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import PrivateRoute from "../routes/PrivateRoute";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      {/* Publics */}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/ForgotPassword"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Privates */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <App />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Annotation"
          element={
            <PrivateRoute>
              <AnnotationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <RegisterPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
