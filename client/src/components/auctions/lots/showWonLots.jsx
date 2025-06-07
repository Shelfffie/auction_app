import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/authContext";
import { Link } from "react-router-dom";
import "../../../../styles/all-lots-show.css";

const WonLots = () => {
  const { user } = useAuth();
  const [wonLots, setWonLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWonLots = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/won/${user.id}`
        );
        if (!response.ok) throw new Error("Не вдалося отримати виграні лоти");
        const data = await response.json();
        setWonLots(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWonLots();
  }, [user.id]);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="show-lots background">
      <div className="space-div">
        <h1 className="tittle-look-lots">Мої виграні лоти</h1>
      </div>

      <div className="lots-panel">
        {wonLots.length === 0 ? (
          <p className="looks-for-lots">Поки немає лотів</p>
        ) : (
          <>
            {wonLots.map((lot) => (
              <Link to={`/lot/${lot.id}`} key={lot.id}>
                <div className="lot-item-show">
                  <h3 className="cell cell1">{lot.title}</h3>

                  <img
                    src={`http://localhost:3000${lot?.image_url}`}
                    alt={lot.title}
                    className="lot-item-img cell cell2"
                  />
                  <p className="cell cell10">
                    Статус оплати:{" "}
                    {lot.payment_status === "paid" ? "Оплачено" : "Не оплачено"}
                  </p>
                  <p className="info-about-lot-description cell cell3">
                    {lot.description}
                  </p>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WonLots;
