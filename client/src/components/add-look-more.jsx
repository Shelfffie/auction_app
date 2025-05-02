import React from "react";
import "../../styles/styles.css";

function LookAddButtons() {
  return (
    <nav className="look-add-buttons">
      <a href="" className="block-for-photo-image">
        <img src="./../../pics/donut.png" alt="" className="donut-image" />
        <h1 className="about-text">Розмістити лот</h1>
      </a>
      <a href="" className="block-for-photo-image">
        <img src="./../../pics/donut.png" alt="" className="donut-image" />
        <h1 className="about-text">Всі лоти</h1>
      </a>
    </nav>
  );
}
export default LookAddButtons;
