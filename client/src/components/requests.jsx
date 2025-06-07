import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/lots.css";
import "../../styles/request.css";
import defaulImage from "../../pics/null-donut.png";

const NewRequest = () => {
  const [passport, setPassport] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const numberCheck = /^\d{9}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passport || !selfie) {
      alert("Будь ласка, завантажте фото");
      return;
    }

    if (!numberCheck.test(phone)) {
      alert("Введіть валідний номер телефону");
      return;
    }

    const confirm = window.confirm("Відправити заявку?");

    if (!confirm) return;

    const formData = new FormData();
    formData.append("passport", passportFile);
    formData.append("selfie", selfieFile);
    formData.append("fullName", fullName);
    formData.append("birthDate", birthDate);
    formData.append("phone", "+380" + phone);

    try {
      const response = await fetch("http://localhost:3000/api/request", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Відповідь сервера:", data);
      if (!response.ok) {
        throw new Error(data.message || "Не вдалося відправити заявку");
      }

      alert("Заявку створено!");
      const requestId = data.id;
      navigate(`/`);
    } catch (error) {
      console.error("Помила створення:", error);
    }
  };

  return (
    <form className="page-container" method="POST" onSubmit={handleSubmit}>
      <p className="create-lot-text">СТВОРИТИ ЗАЯВКУ НА ЗМІНУ СТАТУСУ</p>
      <div className="request-container">
        <div className="passport-selfie-container">
          <div className="photo-container">
            <p>Завантажте фото паспорту</p>
            <img
              src={passport || defaulImage}
              alt="фото-лот"
              className="lot-image"
            />
            <label htmlFor="upload-passport" className="button-for-img">
              Завантажити фото
            </label>
            <input
              id="upload-passport"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPassport(URL.createObjectURL(file));
                  setPassportFile(file);
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
          <div className="photo-container photo-item-center">
            {" "}
            <p>Завантажте власне фото, тримаючи паспорт біля обличчя</p>
            <img
              src={selfie || defaulImage}
              alt="фото-лот"
              className="lot-image"
            />
            <label htmlFor="upload-selfie" className="button-for-img">
              Завантажити фото
            </label>
            <input
              id="upload-selfie"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelfie(URL.createObjectURL(file));
                  setSelfieFile(file);
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
        </div>
        <div className="name-birth-number-container">
          <p>Вкажіть ваше ім'я(ПІБ)</p>
          <input
            type="text"
            placeholder="Введіть ПІБ"
            className="input-name-des"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <p>Вкажіть вашу дату народження</p>
          <input
            type="date"
            className="input-name-des"
            required
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <p>Вкажіть ваш номер телефону</p>
          <div>
            {" "}
            <input
              type="text"
              value="+380"
              className="container-380"
              disabled
            />
            <input
              type="text"
              placeholder="Наприклад: 930000000"
              className="input-phone-number"
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button className="make-request-button">Створити заявку</button>
        </div>
      </div>
    </form>
  );
};

export default NewRequest;
