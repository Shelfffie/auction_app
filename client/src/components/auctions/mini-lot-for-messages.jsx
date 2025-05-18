import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import "../../../styles/messages.css";
import defaulImage from "../../../pics/null-donut.png";

const LotDiv = () => {
  const { auctionId } = useParams();
  const [lotData, setLotData] = useState(null);
  const { user } = useAuth();

  const paymentStatus = {
    unpaid: "Неоплачено",
    paid: "Оплачено",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/lot/${auctionId}`);
        if (!res.ok) throw new Error("Лот не знайдено");
        const data = await res.json();
        setLotData(data);
      } catch (error) {
        console.log("Помилка завантаження лоту:", error);
      }
    };

    fetchData();
  }, [auctionId]);

  return (
    <div className="mini-div-for-lot">
      <img
        src={
          lotData?.image_url
            ? `http://localhost:3000${lotData.image_url}`
            : defaulImage
        }
        alt="фото-лот"
        className="image-for-mini-lot"
      />
      <p className="tittle-minilot">{lotData?.title}</p>

      <div className="payment-status-block">
        <p>Статус оплати:</p>
        <h2>{paymentStatus[lotData?.payment_status]}</h2>
        {lotData?.payment_status === "unpaid" &&
        user?.id !== lotData?.creator?.userId ? (
          <Link to={`/lot/${auctionId}/payment`}>
            <button>Оплатити</button>
          </Link>
        ) : (
          ""
        )}
      </div>
      <Link to={`/lot/${auctionId}`}>
        <p className="return-to-lot">Повернутися до лоту</p>
      </Link>
    </div>
  );
};

export default LotDiv;
