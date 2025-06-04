import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/authContext";

const DeletedOrBannedRpoter = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const allowedPathsForBanned = ["/request-recovery", "/limited"];
  const currentPath = location.pathname;

  useEffect(() => {
    if (isLoading) return;

    const currentPath = location.pathname;

    if (
      user?.status === "banned" &&
      !["/request-recovery", "/limited"].includes(currentPath)
    ) {
      navigate("/limited", { replace: true });
    } else if (user?.status === "deleted" && currentPath !== "/limited") {
      navigate("/limited", { replace: true });
    } else if (
      (!["banned", "deleted"].includes(user?.status) &&
        currentPath === "/limited") ||
      (!["banned"].includes(user?.status) &&
        ["/request-recovery"].includes(currentPath))
    ) {
      navigate("/", { replace: true });
      return;
    }
  }, [user, isLoading, location.pathname, navigate]);

  return children;
};

export default DeletedOrBannedRpoter;
