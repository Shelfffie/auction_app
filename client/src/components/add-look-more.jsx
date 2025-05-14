import React from "react";
import "../../styles/styles.css";
import { Link } from "react-router-dom";

function LookAddButtons() {
  return (
    <nav className="look-add-buttons">
      <Link to="lot/create">
        <div className="block-for-photo-image">
          <img src="./../../pics/donut.png" alt="" className="donut-image" />
          <h1 className="about-text">Розмістити лот</h1>
        </div>
      </Link>
      <Link to="lots">
        <div className="block-for-photo-image">
          <img src="./../../pics/donut.png" alt="" className="donut-image" />
          <h1 className="about-text">Всі лоти</h1>
        </div>
      </Link>
    </nav>
  );
}
export default LookAddButtons;
