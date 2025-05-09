import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/authContext";
import { useParams } from "react-router-dom";

import "../../../styles/lot-id.css";

const BidsContainer = ({ creatorId }) => {
  const { user } = useAuth();
  const [value, setValue] = useState(5);

  const increase = () => setValue((v) => v + 5);
  const decrease = () => setValue((v) => Math.max(0, v - 5));
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, []);

  return (
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
      {user?.id && user.id !== creatorId && (
        <div className="make-bid-container">
          <p>Введіть ставку:</p>
          <div>
            <button
              onClick={decrease}
              disabled={value <= 5}
              className="plus-minus-button"
            >
              −
            </button>
            <input
              type="number"
              value={value}
              className="set-bid-value"
              onChange={(e) => setValue(Number(e.target.value))}
            />
            <button onClick={increase} className="plus-minus-button">
              +
            </button>
          </div>
          <button className="make-bid">Зробити ставку</button>
        </div>
      )}
    </div>
  );
};

export default BidsContainer;
