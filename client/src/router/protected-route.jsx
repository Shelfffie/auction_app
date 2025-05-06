import { Navigate, Outlet, useOutletContext } from "react-router-dom";

function ProtectedRoute({ redirectPath = "/log-in" }) {
  const layoutContext = useOutletContext();
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet context={layoutContext} />;
}

export default ProtectedRoute;
