import React from "react";
import "../../styles/styles.css";

function AboutAuctions() {
  return (
    <section className="about-auctions">
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
        По завершенню - переможець отримує лот, <br /> а виграні кошти
        передаються на <br />
        доброчинну мету.
      </p>
      <div className="buttons-about-sections">
        <a href="" className="create-lot-button-about button-about about-text">
          Створити лот
        </a>
        <a
          href=""
          className="make-bet-button-about button-about about-text-brown"
        >
          Зробити ставку
        </a>
      </div>
    </section>
  );
}

export default AboutAuctions;
