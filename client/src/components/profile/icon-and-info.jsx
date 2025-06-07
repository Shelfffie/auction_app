import React, { useEffect, useState } from "react";
import "./../../../styles/profile.css";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstname: "",
    lastname: "",
  });

  const deleteAccount = async () => {
    const confirm = window.confirm(
      "Ви впевнені, що хочете видалити обліковий запис? Всі ваші ставки та лоти будуть видалені безслідно."
    );
    if (!confirm) return;
    try {
      const response = await fetch(`http://localhost:3000/api/profile/delete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: "deleted" }),
      });

      if (!response.ok) throw new Error("Не вдалося видалити акаунт.");

      window.location.reload();
    } catch (err) {
      console.error("Помилка видалення:", err);
    }
  };

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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Не вдалося оновити профіль");
      }
      const refetch = await fetch("http://localhost:3000/api/profile", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!refetch.ok) throw new Error("Не вдалося отримати оновлений профіль");

      const freshUser = await refetch.json();
      setUserData(freshUser);
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
      <img
        src="./../../../pics/null-donut.png"
        alt=""
        className="profile-icon"
      />
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
          <textarea
            rows="5"
            cols="40"
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
          <div className="edit-delete-block">
            {" "}
            <p
              className="edit-profile big-text"
              onClick={() => setIsEditing(true)}
            >
              Редагувати
            </p>
            <p className="edit-profile big-text" onClick={deleteAccount}>
              Видалити аккаунт
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
