import React, { useEffect, useState } from "react";
import ConfirmModal from "../alertModal";
import "./../../../styles/profile.css";

function ProfilePage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstname: "",
    lastname: "",
  });

  const deleteClick = () => {
    setShowConfirm(true);
  };

  const deleteAccount = async () => {
    setShowConfirm(false);
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
      const formData = new FormData();
      formData.append(
        "name",
        `${editedData.firstname} ${editedData.lastname}`.trim()
      );
      if (editedData.image) {
        formData.append("icon", editedData.image);
      }

      const response = await fetch("http://localhost:3000/api/profile", {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
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
      <div className="div-for-profile-icon">
        <img
          src={
            userData?.profile_icon
              ? `http://localhost:3000${userData.profile_icon}`
              : "./../../../pics/null-donut.png"
          }
          alt=""
          className="profile-icon"
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
      </div>
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
          <div className="edit-delete-block">
            {" "}
            <p
              className="edit-profile big-text"
              onClick={() => setIsEditing(true)}
            >
              Редагувати
            </p>
            <p className="edit-profile big-text" onClick={deleteClick}>
              Видалити аккаунт
            </p>
            {showConfirm && (
              <ConfirmModal
                tittle="Підтвердження видалення"
                message="Ви впевнені, що хочете видалити обліковий запис? Всі ваші ставки та лоти будуть видалені безслідно."
                onConfirm={deleteAccount}
                onCancel={() => setShowConfirm(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
