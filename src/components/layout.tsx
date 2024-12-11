// import { useAuth } from "../context/auth";
import { ReactNode } from "react";
const Layout = ({ children }: { children: ReactNode }) => {
  // const { logout, user } = useAuth();

  return (
    <div className="h-screen">
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
