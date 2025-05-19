import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAuth } from "../hooks/authContext";

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isLoading } = useAuth();

  const hasPermission =
    allowedRoles.length === 0 || allowedRoles.includes(user?.user_role);
  const isLoggedIn = !!user;

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/log-in" replace />;
  }

  if (!hasPermission) {
    return <Navigate to="/request" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
