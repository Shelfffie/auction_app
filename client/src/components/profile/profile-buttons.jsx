import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./../../../styles/profile.css";

function ProfileButtons() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const buttons = [
    {
      label: "Ваші лоти",
      content: "Тимчасовий текст",
    },
    { label: "Активні лоти", content: "Тимчасовий текст" },
    { label: "Завершені лоти", content: "Тимчасовий текст" },
  ];

  const LogOut = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
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
      <button className="menu-button" onClick={LogOut}>
        Вийти з облікового запису
      </button>
    </div>
  );
}

export default ProfileButtons;
