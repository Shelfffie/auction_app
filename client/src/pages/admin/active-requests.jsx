import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ShowActiveRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/requests/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Помилка при завантаженні:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ color: "bisque" }}>
      <h1>Необроблені заявки</h1>
      <Link to="/requests/history">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Переглянути історію всіх заявок
        </p>
      </Link>
      {loading ? (
        <p>Завантаження..</p>
      ) : requests.length === 0 ? (
        <p>Наразі немає непереглянутих заявок</p>
      ) : (
        requests.map((request) => (
          <Link to={`/request/${request.id}`} key={request.id}>
            <div
              style={{
                border: "2px solid black",
                width: "500px",
                margin: "10px",
              }}
            >
              <p>Айді заяви: {request.id}</p>
              <p>Перейти</p>
            </div>
          </Link>
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
export default ShowActiveRequests;
