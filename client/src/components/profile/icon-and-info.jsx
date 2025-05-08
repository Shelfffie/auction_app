import React, { useEffect, useState } from "react";
import "./../../../styles/profile.css";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstname: "",
    lastname: "",
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
      .then((data) => {
        setUserData(data);
        const [firstname, lastname] = data.name
          ? data.name.split(" ")
          : ["", ""];
        setEditedData({
          firstname,
          lastname,
        });
      })
      .catch((err) => console.error("Помилка завантаження профілю:", err));
  }, []);

  const roleLabels = {
    user: "Учасник",
    organizer: "Аукціоніст",
    admin: "Адміністратор",
  };

  const editChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const SaveChanges = async () => {
    try {
      const updatedUser = {
        name: `${editedData.firstname} ${editedData.lastname}`.trim(),
      };

      const response = await fetch("http://localhost:3000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedUser),
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
            name="firstname"
            value={editedData.firstname}
            onChange={editChange}
            className="editing-input"
          />
        ) : (
          <p className="personal-info">{firstname || "Ім'я"}</p>
        )}
        <p>Прізвище</p>
        {isEditing ? (
          <input
            type="text"
            name="lastname"
            value={editedData.lastname}
            onChange={editChange}
            className="editing-input"
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
        <p>Роль користувача:</p>
        <p className="personal-info">
          {roleLabels[userData?.user_role] || "Користувач"}
        </p>
      </div>
      <div className="edit-block">
        {isEditing ? (
          <p onClick={SaveChanges} className="edit-profile big-text">
            Зберегти зміни
          </p>
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
