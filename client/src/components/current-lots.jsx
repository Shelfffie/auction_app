import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/styles.css";

function CurrentLots() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/lots/latest");
        const data = await response.json();
        console.log("DATA FROM API:", data);
        if (Array.isArray(data) && data.length > 0) {
          setLots(data);
        } else {
          console.log("Лоти не знайдено або неправильний формат даних", data);
        }
      } catch (error) {
        console.error("Помилка при завантаженні лотів:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);
  return (
    <article className="currents-lots">
      <p className="about-title lots-tittle">Актуальні лоти</p>
      <div className="buttons-lots">
        {lots.map((lot) => (
          <Link to={`/lot/${lot.id}`} className="auctions-block" key={lot.id}>
            <div className="block-for-lot">
              <img src={lot.image_url} alt={lot.title} />
              <h3>{lot.title}</h3>
              <p>{lot.description}</p>
            </div>
          </Link>
        ))}
        <a href="" className="auctions-block">
          Переглянути всі...
        </a>
      </div>
    </article>
  );
}

export default CurrentLots;
