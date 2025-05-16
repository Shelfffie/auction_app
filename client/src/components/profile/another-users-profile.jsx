import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../../styles/profile.css";

function UserProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/${id}`);
        if (!res.ok) throw new Error("Користувача не знайдено");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.log("Помилка завантаження профілю:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <div className="profile-info">
        <div className="general-information">
          <p className="big-text">Такого користувача не існує</p>
          <button onClick={goBack} className="go-back-button">
            Повернутись
          </button>
        </div>
      </div>
    );
  }

  if (!userData) return <div>Завантаження профілю...</div>;

  const [firstname, lastname] = userData.name
    ? userData.name.split(" ")
    : ["", ""];

  const roleLabels = {
    user: "Учасник",
    organizer: "Аукціоніст",
    admin: "Адміністратор",
  };

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
        <p className="personal-info">{firstname || "Ім'я"}</p>
        <p>Прізвище</p>
        <p className="personal-info">{lastname || "Прізвище"}</p>
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
    </div>
  );
}

export default UserProfilePage;
