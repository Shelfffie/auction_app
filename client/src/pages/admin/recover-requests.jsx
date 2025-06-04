import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ShowActiveAppeals() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = `Апеляції`;
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/active-recover-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAppeals(data);
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/active-recover-list`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Не вдалося змінити статус");
      const data = await res.json();
      alert(data.message);
      setAppeals((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Помилка зміни статусу");
    }
  };

  return (
    <div style={{ color: "bisque" }}>
      <h1>Необроблені апеляції</h1>
      <Link to="/recovery-requests/history">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Переглянути історію всіх апеляцій
        </p>
      </Link>
      {loading ? (
        <p>Завантаження..</p>
      ) : appeals.length === 0 ? (
        <h1>Наразі немає непереглянутих заявок</h1>
      ) : (
        appeals.map((appeal) => (
          <div
            key={appeal.id}
            style={{
              border: "2px solid black",
              width: "500px",
              margin: "10px",
            }}
          >
            <p>Айді заяви: {appeal.id}</p>
            <p>Опис заяви: {appeal.description}</p>
            <p>
              Айді та ПІ користувача: {appeal.user_id} {appeal.banned_user.name}
            </p>
            <p>Статус заяви: {appeal.status}</p>
            <p>
              Дата подання:{" "}
              {appeal.created_at
                ? new Date(appeal.created_at).toLocaleString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "Невідомо"}
            </p>
            <button onClick={() => handleStatusChange(appeal.id, "approved")}>
              Підтвердити
            </button>
            <button onClick={() => handleStatusChange(appeal.id, "rejected")}>
              Відхілити
            </button>
          </div>
        ))
      )}
      <Link to="/admin-panel">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Повернутися на адмін панель
        </p>
      </Link>
    </div>
  );
}
export default ShowActiveAppeals;
