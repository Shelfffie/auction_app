import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/authContext";
import { Link } from "react-router-dom";
import { SITE_TITLE } from "../../../siteTittle";
import BidsContainer from "../bids";
import AuctionControl from "../control-panel";
import "../../../../styles/lots.css";
import "../../../../styles/lot-id.css";
import defaulImage from "../../../../pics/null-donut.png";

const LotId = () => {
  const formatDateForInput = (isoString) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date - offset).toISOString().slice(0, 16);
    return localISO;
  };

  const formatInputToISO = (localDateTime) => {
    const localDate = new Date(localDateTime);
    return localDate.toISOString();
  };

  const LINK = `http://localhost:3000/api/lot/`;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [lotData, setLotData] = useState(null);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    startedPrice: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [lotStatus, setLotStatus] = useState(null);

  const goBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${LINK}${id}`);
        if (!res.ok) throw new Error("Лот не знайдено");
        const data = await res.json();
        setLotData(data);
        setEditedData({
          title: data.title || "",
          description: data.description || "",
          startTime: data.start_time ? formatDateForInput(data.start_time) : "",
          endTime: data.end_time ? formatDateForInput(data.end_time) : "",
          startedPrice: data.start_price || "",
        });
        setLotStatus(data.status);
      } catch (error) {
        console.log("Помилка завантаження лоту:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (lotData?.title) {
      document.title = `${SITE_TITLE} - ${lotData.title}`;
    } else {
      document.title = `${SITE_TITLE} - Такого лоту не існує!`;
    }
  }, [lotData]);

  const editChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const finishAuction = async () => {
    const confirm = window.confirm(
      "Ви впевнені, що хочете завершити лот передчасно?"
    );
    if (!confirm) return;
    try {
      const now = new Date();
      const formattedNow = formatInputToISO(now);

      const response = await fetch(`${LINK}${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "ended", end_time: formattedNow }),
      });

      if (!response.ok) throw new Error("Не вдалося завершити");

      const updated = await response.json();
      setLotStatus(updated.status);

      const fullData = await fetch(`${LINK}${id}`);
      const data = await fullData.json();
      setLotData(data);
      setEditedData((prevData) => ({
        ...prevData,
        endTime: formatDateForInput(data.end_time),
      }));
    } catch (err) {
      console.error("Помилка завершення аукціону:", err);
    }
  };

  const toggleAuctionStatus = async () => {
    const confirm = window.confirm("Ви впевнені, що хочете відмінити лот?");
    if (!confirm) return;

    const newStatus = lotStatus === "cancelled" ? "pending" : "cancelled";

    let newStartTime = editedData.startTime;
    if (newStatus === "pending") {
      const now = new Date();
      now.setHours(now.getHours() + 24);
      newStartTime = formatInputToISO(now.toISOString());
    }

    try {
      const response = await fetch(`${LINK}${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, start_time: newStartTime }),
      });

      if (!response.ok) throw new Error("Не вдалося змінити статус");

      const updated = await response.json();
      setLotStatus(updated.status);
      setEditedData((prevData) => ({
        ...prevData,
        startTime: newStartTime,
        end_time: formatInputToISO(editedData.endTime),
      }));

      const fullData = await fetch(`${LINK}${id}`);
      const data = await fullData.json();
      setLotData(data);
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
    }
  };

  const SaveChanges = async () => {
    const confirm = window.confirm("Ви впевнені, що хочете зберегти лот?");
    if (!confirm) return;

    const now = new Date();
    const start = new Date(editedData.startTime);
    const end = new Date(editedData.endTime);
    const price = parseFloat(editedData.startedPrice);

    if (
      lotData.status !== "ended" &&
      lotData.status !== "active" &&
      start < now
    ) {
      alert("Дата початку не може бути в минулому.");
      return;
    }

    const endData = new Date(start);
    endData.setDate(start.getDate() + 10);
    if (end > endData) {
      alert(
        "Дата завершення не може бути більше ніж через 10 днів після початку."
      );
      return;
    }

    if (price > 10000) {
      alert("Початкова ціна не може перевищувати 10000.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editedData.title);
      formData.append("description", editedData.description);
      formData.append("start_time", formatInputToISO(editedData.startTime));
      formData.append("end_time", formatInputToISO(editedData.endTime));
      formData.append("start_price", editedData.startedPrice);

      if (editedData.image) {
        formData.append("image", editedData.image);
      }

      const response = await fetch(`${LINK}${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося оновити лот");
      }
      const updated = await fetch(`${LINK}${id}`);
      const fullData = await updated.json();
      setLotData(fullData);
      setIsEditing(false);
    } catch (err) {
      console.log("Помилка збереження лоту:", err);
    }
  };

  const hadnleDelete = async () => {
    const confirmDelete = window.confirm(
      "Ви впевнені, що хочете видалити лот?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${LINK}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Не вдалося видалити лот");
      }

      alert("Лот успішно видалено");
      navigate("/");
    } catch (error) {
      console.error("Помилка видалення лоту:", error);
      alert("Щось пішло не так при видаленні");
    }
  };

  if (error) {
    return (
      <div className="page-container">
        <p className="create-lot-text">Такого лоту не існує</p>
        <button className="go-back-button" onClick={goBack}>
          Повернутись
        </button>
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
    pending: "Очікується...",
    active: "Активний",
    ended: "Завершений",
    cancelled: "Відмінений",
  };

  const userImageSrc = lotData?.creator?.profile_icon
    ? `http://localhost:3000${lotData.creator.profile_icon}`
    : defaultImage;

  return (
    <div className="page-container-lot-id">
      <div className="phono-name">
        <div className="container-for-photo">
          <img
            src={`http://localhost:3000${lotData?.image_url}` || defaulImage}
            alt="фото-лот"
            className="image-lot"
          />
          {isEditing && (
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setEditedData({ ...editedData, image: e.target.files[0] })
              }
            />
          )}
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editedData.title || ""}
              onChange={editChange}
              className="editing-lot-input"
            />
          ) : (
            <p className="lot-information p">{lotData?.title}</p>
          )}
        </div>
        <BidsContainer
          creatorId={lotData?.creator?.userId}
          auctionStatus={lotData?.status}
          lotId={id}
          startedPrice={lotData?.start_price}
        />
      </div>
      <div className="description-lot">
        <div className="desctiption">
          <div>
            <p className="lot-info">Cтатус аукціону:</p>
            <p>{auctionStatus[lotData?.status]}</p>
          </div>

          {lotData?.status !== "cancelled" && (
            <>
              <div>
                <p className="lot-info">Початок аукціону:</p>

                {isEditing ? (
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={editedData.startTime || ""}
                    onChange={editChange}
                    className="editing-lot-input"
                  />
                ) : (
                  <p>
                    {lotData?.start_time
                      ? new Date(lotData.start_time).toLocaleDateString(
                          "uk-UA",
                          dataFormat
                        )
                      : "Дата створення"}
                  </p>
                )}
              </div>

              <div>
                <p className="lot-info">Закінчення аукціону:</p>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={editedData.endTime || ""}
                    onChange={editChange}
                    className="editing-lot-input"
                  />
                ) : (
                  <p>
                    {lotData?.end_time
                      ? new Date(lotData.end_time).toLocaleDateString(
                          "uk-UA",
                          dataFormat
                        )
                      : "Дата створення"}
                  </p>
                )}
              </div>

              <div>
                <p className="lot-info">Початкова ціна:</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="startedPrice"
                    value={editedData.startedPrice || ""}
                    onChange={editChange}
                    className="editing-lot-input"
                  />
                ) : (
                  <p>{lotData?.start_price || "Початкова ціна"}</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="description-and-organizer">
          <div className="description-info">
            <p className="lot-info">Опис лота:</p>
            <div>
              {isEditing ? (
                <textarea
                  type="textarea"
                  name="description"
                  value={editedData.description}
                  onChange={editChange}
                  className="editing-lot-input textarea"
                />
              ) : (
                <p>{lotData?.description || "Опис"}</p>
              )}
            </div>
          </div>
          <p className="organizator-tittle">Організатор:</p>
          <div className="organizator-info">
            <img
              src={
                lotData?.creator?.profile_icon
                  ? `http://localhost:3000${lotData?.creator?.profile_icon}`
                  : defaulImage
              }
              alt=""
              className="user-pic"
            />
            <div className="name-and-data-user">
              <h2>
                <Link
                  to={
                    user?.id === lotData?.creator?.userId
                      ? "/profile"
                      : `/user/${lotData?.creator?.userId}`
                  }
                >
                  {lotData?.creator?.name}
                </Link>
              </h2>
              <p>
                На сайті з{" "}
                {lotData?.creator?.user_created
                  ? new Date(lotData?.created_at).toLocaleDateString("uk-UA", {
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
      {(user?.id === lotData?.creator?.userId || user?.user_role === "admin") &&
        (isEditing ? (
          <div className="control-panel-container">
            <button onClick={SaveChanges}>Зберегти зміни</button>
          </div>
        ) : (
          <AuctionControl
            onEdit={toggleEditMode}
            onToggleStatus={toggleAuctionStatus}
            auctionStatus={lotData.status}
            onFinish={finishAuction}
            onDelete={hadnleDelete}
            creatorId={lotData?.creator?.userId}
          />
        ))}
    </div>
  );
};

export default LotId;
