import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";

function RedirectIfAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default RedirectIfAuth;
