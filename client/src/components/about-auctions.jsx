import React from "react";
import "../../styles/styles.css";
import { Link, useNavigate } from "react-router-dom";

function AboutAuctions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleClick = () => {
    if (!token) {
      navigate("/log-in");
    } else {
      navigate("/lots");
    }
  };

  return (
    <section className="about-auctions" id="about-auctions">
      <img src="./../../pics/two-hands.png" alt="" className="two-hands-png" />
      <p className="about-title">Про аукціони</p>
      <p className="about-text-brown">1. Створення</p>
      <p className="about-text">
        Створи лот - це може бути річ або <br /> послуга.{" "}
      </p>
      <div className="mini-brown-block">
        <p className="about-text">2. Участь</p>
        <p className="about-text">Бери участь та роби ставки.</p>
      </div>
      <p className="about-text-brown">3. Завершення</p>
      <p className="about-text">
        По завершенню - переможець отримує лот, а<br />
        виграні кошти передаються на <br />
        доброчинну мету.
      </p>
      <div className="buttons-about-sections">
        <Link to="lot/create">
          <p className="create-lot-button-about button-about about-text">
            Створити лот
          </p>
        </Link>
        <p
          className="make-bet-button-about button-about about-text-brown"
          onClick={handleClick}
        >
          Зробити ставку
        </p>
      </div>
    </section>
  );
}

export default AboutAuctions;
