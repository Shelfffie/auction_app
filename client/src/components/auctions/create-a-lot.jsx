import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/lots.css";
import defaulImage from "../../../pics/null-auction-image.png";
import ConfirmModal from "../alertModal";

const CreateLot = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startPrice, setStartPrice] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setShowAlertMessage("Будь ласка, завантажте фото");
      setShowAlert(true);
      return;
    }

    const price = parseFloat(startPrice);
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(price) || price <= 0 || price > 10000) {
      setShowAlertMessage("Початкова ціна має бути більше 0 та менше 10 000");
      setShowAlert(true);
      return;
    }

    if (start < now) {
      setShowAlertMessage("Дата початку не може бути в минулому.");
      setShowAlert(true);
      return;
    }

    if (end <= start) {
      setShowAlertMessage("Дата завершення має бути пізніше дати початку");
      setShowAlert(true);
      return;
    }

    const maxEnd = new Date(start);
    maxEnd.setDate(start.getDate() + 10);
    if (end > maxEnd) {
      setShowAlertMessage(
        "Дата завершення не може бути більше ніж через 10 днів після початку"
      );
      setShowAlert(true);
      return;
    }

    setShowConfirm(true);
  };

  const createLotSubmit = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_price", parseFloat(startPrice));
    formData.append("start_time", startDate);
    formData.append("end_time", endDate);

    try {
      const response = await fetch("http://localhost:3000/api/lots/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Не вдалося створити лот");
      }

      setShowAlertMessage("Лот успішно створено!");
      setShowAlert(true);
      const lotId = data.id;
      navigate(`/lot/${lotId}`);
    } catch (error) {
      console.error("Помила створення:", error);
    }
  };

  return (
    <form className="page-container" method="POST" onSubmit={handleSubmit}>
      <p className="create-lot-text">СТВОРИТИ ЛОТ</p>
      <div className="phono-name">
        <div className="photo-container">
          <p>ФОТО</p>
          <img
            src={image || defaulImage}
            alt="фото-лот"
            className="lot-image"
          />
          <label htmlFor="upload-photo" className="button-for-img">
            Завантажити фото
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(URL.createObjectURL(file));
                setImageFile(file);
              }
            }}
            style={{
              position: "absolute",
              opacity: 0,
              width: "1px",
              height: "1px",
            }}
            className="button-for-img"
            required
          />
        </div>
        <div className="name-description">
          <p>Вкажіть назву та опис</p>
          <p>Назва</p>
          <input
            type="text"
            name="tittle"
            placeholder="Введіть назву"
            className="input-name-des"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <p>Опис</p>
          <textarea
            rows="5"
            cols="40"
            name="description"
            className="input-name-des textarea-desctiption"
            placeholder="Введіть опис товару"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="block-for-time-etc">
        <div className="time-block-create">
          <p>Початок аукціону</p>
          <input
            type="datetime-local"
            name="start"
            className="input-name-des"
            required
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p>Кінець аукціону</p>
          <input
            type="datetime-local"
            name="end"
            className="input-name-des"
            required
            onChange={(e) => setEndDate(e.target.value)}
          />
          <p>Початкова ціна (в грн)</p>
          <input
            type="number"
            className="input-name-des"
            name="start-price"
            placeholder="Ведіть число, наприклад: 200"
            min="1"
            step="1"
            required
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
          />
        </div>
        <div className="container-for-button">
          <button className="create-a-lot-button">Створити аукціон</button>
        </div>
      </div>
      {showAlert && (
        <ConfirmModal
          tittle=" "
          message={showAlertMessage}
          onConfirm={() => setShowAlert(false)}
          showCancel={false}
        />
      )}
      {showConfirm && (
        <ConfirmModal
          tittle="Підтвердження створення"
          message="Створити лот?"
          onConfirm={() => {
            setShowConfirm(false);
            createLotSubmit();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </form>
  );
};

export default CreateLot;
