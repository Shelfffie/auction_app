import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ redirectPath = "/log-in" }) {
  const isLoggedIn = !!localStorage.getItem("userId");

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
