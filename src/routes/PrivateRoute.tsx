import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
