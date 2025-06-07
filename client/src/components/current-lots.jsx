import React from "react";
import { useEffect, useState } from "react";
import defaulImage from "../../pics/null-donut.png";
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
        {loading ? (
          <p className="about-title lots-tittle">Завантаження..</p>
        ) : lots.length === 0 ? (
          <p className="about-title">Наразі немає актуальних лотів</p>
        ) : (
          <>
            {lots.map((lot) => (
              <Link
                to={`/lot/${lot.id}`}
                className="auctions-block-div"
                key={lot.id}
              >
                <div className="block-for-lot">
                  <div className="img-div">
                    <img
                      src={`http://localhost:3000${lot?.image_url}`}
                      alt={lot.title}
                      className="current-lots-img"
                    />
                    <h3>{lot.title}</h3>
                  </div>
                  <div className="description-current-lot">
                    <p>{lot.description}</p>
                  </div>
                  <div className="organizer-block">
                    <img
                      src={defaulImage}
                      alt=""
                      className="current-user-pic"
                    />
                    <h4>{lot?.creator?.name}</h4>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="lots">
              <div className="look-for-all">
                <p>Переглянути всі...</p>
              </div>
            </Link>
          </>
        )}
      </div>
    </article>
  );
}

export default CurrentLots;
