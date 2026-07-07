import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function RoleRedirect() {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "DOSEN") {
    return <Navigate to="/dosen/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default RoleRedirect;