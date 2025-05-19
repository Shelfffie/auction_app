import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/authContext";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import "./../../../styles/profile.css";

function ProfileButtons() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <>
      <div className="div-for-profile-buttons">
        {(user?.user_role === "admin" || user?.user_role === "organizer") && (
          <Link to="/my-lots">
            <button className="menu-button">Мої лоти</button>
          </Link>
        )}
        {user?.user_role === "user" && (
          <Link to="/request">
            <button className="menu-button">
              Подати заявку на зміну статусу
            </button>
          </Link>
        )}
        <Link to="/lots/won">
          <button className="menu-button">Виграні лоти</button>
        </Link>
        <Link to="/my-bids">
          <button className="menu-button">Мої ставки</button>
        </Link>
        {(user?.user_role === "admin" || user?.user_role === "organizer") && (
          <Link to="/lot/create">
            <button className="menu-button">Створити лот</button>
          </Link>
        )}
        <button className="menu-button" onClick={handleLogout}>
          Вийти з облікового запису
        </button>
      </div>
      {user?.user_role === "admin" && (
        <Link to="/admin-panel">
          <button className="menu-button">Адмін</button>
        </Link>
      )}
    </>
  );
}

export default ProfileButtons;
