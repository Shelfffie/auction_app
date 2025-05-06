import React, { useEffect, useState } from "react";
import "./../../../styles/profile.css";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Додаємо стан для редагування
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/api/profile`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Користувача не знайдено");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => console.error("Помилка завантаження профілю:", err));
  }, []);

  const editChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const SaveChanges = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error("Не вдалося оновити профіль");
      }
      const data = await response.json();
      setUserData(data);
      setIsEditing(false);
    } catch (error) {
      console.log("Помилка збереження профілю:", error);
    }
  };
  if (!userData) {
    return <div>Завантаження профілю...</div>;
  }
  const [firstname, lastname] = userData?.name
    ? userData.name.split(" ")
    : ["", ""];

  return (
    <div className="profile-info">
      <img src="./../../../pics/donut.png" alt="" className="profile-icon" />
      <div className="general-information">
        <p className="big-text">Основна інформація:</p>
        <p>Ім'я</p>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedData.name}
            onChange={editChange}
          />
        ) : (
          <p className="personal-info">{firstname || "Ім'я"}</p>
        )}
        <p>Прізвище</p>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedData.name}
            onChange={editChange}
          />
        ) : (
          <p className="personal-info">{lastname || "Прізвище"}</p>
        )}
        <p>Email-адреса</p>
        <p className="personal-info">{userData?.email || "Пошта"}</p>
        <p>Дата створення аккаунту:</p>
        <p className="personal-info">
          {userData?.created_at
            ? new Date(userData.created_at).toLocaleDateString("uk-UA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Дата"}
        </p>
      </div>
      <div className="edit-block">
        {isEditing ? (
          <button onClick={SaveChanges}>Зберегти зміни</button>
        ) : (
          <p
            className="edit-profile big-text"
            onClick={() => setIsEditing(true)}
          >
            Редагувати
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
