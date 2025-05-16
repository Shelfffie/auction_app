import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../../../styles/lots.css";
import "../../../styles/request.css";
import defaulImage from "../../../pics/null-donut.png";

const RequestAboutId = () => {
  const { id } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/request/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Такої заявки не інує");
        const data = await res.json();
        setRequestData({
          ...data,
          requester: data.requester || { id: "Невідомо", name: "Невідомо" },
        });
      } catch (error) {
        console.log("Помилка завантаження:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/request/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Не вдалося змінити статус");
      const data = await res.json();
      alert(data.message);
      setRequestData((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error(error);
      alert("Помилка зміни статусу");
    }
  };

  return (
    <div className="page-container">
      <p className="create-lot-text">ЗАЯВКА НОМЕР {id}</p>
      <div className="request-container">
        <div className="passport-selfie-container">
          <div className="photo-container">
            <p>Фото паспорту</p>
            <img
              src={
                `http://localhost:3000${requestData?.passport_path}` ||
                defaulImage
              }
              alt="фото-лот"
              className="passport-selfie-image"
            />
          </div>
          <div className="photo-container photo-item-center">
            {" "}
            <p>Селфі з паспортом</p>
            <img
              src={
                `http://localhost:3000${requestData?.selfie_path}` ||
                defaulImage
              }
              alt="фото-лот"
              className="passport-selfie-image"
            />
          </div>
        </div>
        <div className="name-birth-number-container">
          <p>СТАТУС ЗАЯВКИ: {requestData?.status}</p>
          <p>ПІБ: {requestData?.fullName}</p>
          <p>Дата народження: {requestData?.birthDate}</p>
          <p>Номер телефону: {requestData?.phone}</p>
          <p>
            Дата створення заявки:{" "}
            {requestData?.created_at
              ? new Date(requestData.created_at).toLocaleString("uk-UA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "Невідомо"}
          </p>
          <p>Айді користувача: {requestData?.requester?.id}</p>
          <p>Ім'я користувача: {requestData?.requester?.name}</p>
          <div>
            {requestData?.status === "pending" && (
              <>
                <button onClick={() => handleStatusChange("approved")}>
                  Підтвердити
                </button>
                <button onClick={() => handleStatusChange("rejected")}>
                  Відхілити
                </button>
              </>
            )}
            <Link to="/requests">
              <p style={{ textDecoration: "underline", cursor: "pointer" }}>
                Повернутися до активних заявок
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestAboutId;
