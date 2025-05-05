import React, { useState } from "react";
import "./../../../styles/profile.css";

function ProfileButtons() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const buttons = [
    {
      label: "Ваші лоти",
      content: "Тимчасовий текст",
    },
    { label: "Активні лоти", content: "Тимчасовий текст" },
    { label: "Завершені лоти", content: "Тимчасовий текст" },
  ];

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
      <button className="menu-button">Видалити обліковий запис</button>
    </div>
  );
}

export default ProfileButtons;
