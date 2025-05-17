
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AuthStatus.LOADING) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === AuthStatus.UNAUTHENTICATED) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
