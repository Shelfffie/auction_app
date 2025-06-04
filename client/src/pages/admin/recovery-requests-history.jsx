import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecoverRequestsHistory() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    document.title = `Адмін - архів заявок`;
  }, []);

  const fetchRequests = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/recover-history?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Помилка відповіді від сервера");
      }

      const data = await response.json();
      setAppeals(data.requests);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Помилка при завантаженні заявок:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ color: "bisque" }}>
      <h1>Історія апеляцій:</h1>
      <Link to="/recovery-requests">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Переглянути активні апецялії
        </p>
      </Link>

      {loading ? (
        <p>Завантаження...</p>
      ) : appeals.length === 0 ? (
        <p>Немає заявок</p>
      ) : (
        appeals.map((appeal) => (
          <div
            key={appeal.id}
            style={{
              border: "2px solid black",
              width: "500px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>Id заяви: {appeal.id}</p>
            <p>Опис заяви: {appeal.description}</p>
            <p>
              Id та ПІ користувача: {appeal.user_id} {appeal.banned_user.name}
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
          </div>
        ))
      )}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          ◀
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={page === pageNum ? "active" : ""}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          ▶
        </button>
      </div>
      <Link to="/admin-panel">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Повернутися на адмін панель
        </p>
      </Link>
    </div>
  );
}

export default RecoverRequestsHistory;
