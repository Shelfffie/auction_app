import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";

const OnlyUserOrGuestRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  if (!user || user.user_role === "user") {
    return children;
  }

  return <Navigate to="/log-in" replace />;
};

export default OnlyUserOrGuestRoute;
