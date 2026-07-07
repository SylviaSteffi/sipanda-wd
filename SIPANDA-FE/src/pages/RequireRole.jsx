import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RequireRole({ allowedRole, children }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}