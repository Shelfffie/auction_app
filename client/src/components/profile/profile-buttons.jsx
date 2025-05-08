import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/authContext";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import "./../../../styles/profile.css";

function ProfileButtons() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const buttons = [
    {
      label: "Ваші лоти",
      content: "Тимчасовий текст",
    },
    { label: "Активні лоти", content: "Тимчасовий текст" },
  ];

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="div-for-profile-buttons">
      {buttons.map((btn, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="menu-item"
        >
          <button className="menu-button">{btn.label}</button>
          {hoveredIndex === index && (
            <div className="hover-block">{btn.content}</div>
          )}
        </div>
      ))}
      {(user?.user_role === "admin" || user?.user_role === "organizer") && (
        <Link to="/lot/create">
          <button className="menu-button">Створити лот</button>
        </Link>
      )}
      <button className="menu-button" onClick={handleLogout}>
        Вийти з облікового запису
      </button>
    </div>
  );
}

export default ProfileButtons;
