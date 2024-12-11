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
import Annotation from "../pages/annotation";
import ForgotPassword from "../pages/forgotPassword";
import Login from "../pages/login";
import PrivateRoute from "../routes/PrivateRoute";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
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
              <Annotation />
            </PrivateRoute>
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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
