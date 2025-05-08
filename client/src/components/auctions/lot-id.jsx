import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/lots.css";
import "../../../styles/lot-id.css";
import defaulImage from "../../../pics/null-donut.png";

const LotId = () => {
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="page-container">
      <div className="phono-name">
        <div className="container-for-photo">
          <img src="" alt="фото-лот" className="image-lot" />
          <p className="lot-information p">Назва лоту тимччасова</p>
        </div>
        <div className="container-for-bids">
          <p>Історія ставок</p>
          <div className="scroll-bids-list" ref={scrollBoxRef}>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
            <p>контент</p>
          </div>
          <button className="make-bid">Зробити ставку</button>
        </div>
      </div>
      <div className="description-lot">
        <div>
          <p>Опиc:</p>

          <p>Статус:</p>

          <p>Дата створення лота:</p>

          <p>Початок аукціону:</p>

          <p>Закінчення аукціону:</p>

          <p>Початкова ціна:</p>

          <p>Автор</p>
        </div>
        <div className="container-for-button"></div>
      </div>
    </div>
  );
};

export default LotId;
