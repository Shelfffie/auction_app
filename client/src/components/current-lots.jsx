import React from "react";
import "../../styles/styles.css";

function CurrentLots() {
  return (
    <article className="currents-lots">
      <p className="about-title lots-tittle">Актуальні лоти</p>
      <div className="buttons-lots">
        <a href="" className="auctions-block">
          <div className="block-for-lot">lot1</div>
        </a>
        <a href="" className="auctions-block">
          <div className="block-for-lot">lot2</div>
        </a>
        <a href="" className="auctions-block">
          Переглянути всі...
        </a>
      </div>
    </article>
  );
}

export default CurrentLots;
