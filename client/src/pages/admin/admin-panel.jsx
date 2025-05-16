import React from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        color: "bisque",
        textDecoration: "underline",
        margin: "20px",
      }}
    >
      <h1>Контроль панель</h1>
      <Link to="/users-and-lots">1. Контроль користувачів та лотів</Link>
      <Link to="/requests">2. Заяви на зміну статусу</Link>
      <Link to="/">
        <button>Повернутись на сайт</button>
      </Link>
    </div>
  );
};

export default AdminPanel;
