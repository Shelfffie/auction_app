import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { Link } from "react-router-dom";
import BidsContainer from "./bids";
import AuctionControl from "./control.-panel";
import "../../../styles/lots.css";
import "../../../styles/lot-id.css";
import defaulImage from "../../../pics/null-donut.png";

const LotId = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [lotData, setLotData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/lot/${id}`);
        if (!res.ok) throw new Error("Лот не знайдено");
        const data = await res.json();
        setLotData(data);
      } catch (error) {
        console.log("Помилка завантаження лоту:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <div className="page-container">
        <p className="big-text">Такого лоту не існує</p>
      </div>
    );
  }

  if (!lotData) return <div>Завантаження лоту...</div>;

  const dataFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const auctionStatus = {
    on_hold: "Очікується...",
    active: "Активний",
    ended: "Завершений",
    cancelled: "Відмінений",
  };

  const lotsInfo = [
    {
      title: "Статус:",
      content: auctionStatus[lotData?.status] || "Статус аукціону",
    },
    {
      title: "Початок аукціону:",
      content: lotData?.start_time
        ? new Date(lotData.start_time).toLocaleDateString("uk-UA", dataFormat)
        : "Дата створення",
    },
    {
      title: "Закінчення аукціону:",
      content: lotData?.end_time
        ? new Date(lotData.end_time).toLocaleDateString("uk-UA", dataFormat)
        : "Дата створення",
    },
    {
      title: "Початкова ціна:",
      content: lotData?.start_price || "Початкова ціна",
    },
    {
      title: "Дата створення лота:",
      content: lotData?.created_at
        ? new Date(lotData.created_at).toLocaleDateString("uk-UA", dataFormat)
        : "Дата створення",
    },
  ];

  return (
    <div className="page-container">
      <div className="phono-name">
        <div className="container-for-photo">
          <img
            src={`http://localhost:3000${lotData?.image_url}` || defaulImage}
            alt="фото-лот"
            className="image-lot"
          />
          <p className="lot-information p">{lotData?.title}</p>
        </div>
        <BidsContainer
          creatorId={lotData?.creator.userId}
          auctionStatus={lotData?.status}
        />
      </div>
      <div className="description-lot">
        <div className="desctiption">
          {lotsInfo.map((info, index) => (
            <div key={index}>
              <p className="lot-info">{info.title}</p>
              <p>{info.content}</p>
            </div>
          ))}
        </div>
        <div className="description-and-organizer">
          <div className="description-info">
            <p className="lot-info">Опис лота:</p>
            <div>
              <p>{lotData?.description || "Опис"}</p>
            </div>
          </div>
          <p className="organizator-tittle">Організатор:</p>
          <div className="organizator-info">
            <img src={defaulImage} alt="" className="user-pic" />
            <div className="name-and-data-user">
              <h2>
                <Link
                  to={
                    user?.id === lotData?.creator.userId
                      ? "/profile"
                      : `/user/${lotData?.creator.userId}`
                  }
                >
                  {lotData?.creator.name}
                </Link>
              </h2>
              <p>
                На сайті з{" "}
                {lotData?.creator.user_created
                  ? new Date(lotData.created_at).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Дата приєднання"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AuctionControl />
    </div>
  );
};

export default LotId;
