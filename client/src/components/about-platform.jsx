import React from "react";
import "../../styles/styles.css";

function AboutApp() {
  return (
    <main className="app-description">
      <div className="platform-description">
        <p className="about-title">
          Платформа для створення <br /> благодійних аукціонів
        </p>
        <p className="about-text">
          Розміщуй, купуй, змінюй світ - на DonutON. <br />
          Створи власний аукціон, або підтримай інші ініціативи. Виставляй
          <br /> лоти, розміщуй фото, керуй ставками - ми подбаємо про решту.
        </p>
      </div>
      <div className="photo1-container">
        <img src="./../../pics/hand-heart.png" alt="" />
      </div>
    </main>
  );
}

export default AboutApp;
