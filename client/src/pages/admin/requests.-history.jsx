import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RequestsHistory() {
  const [requests, setRequests] = useState([]);
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
        `http://localhost:3000/api/requests/history?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setRequests(data.requests);
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
      <h1>Історія заявок:</h1>
      <Link to="/requests">
        <p style={{ textDecoration: "underline", cursor: "pointer" }}>
          Переглянути активні заявки
        </p>
      </Link>

      {loading ? (
        <p>Завантаження...</p>
      ) : requests.length === 0 ? (
        <p>Немає заявок</p>
      ) : (
        requests.map((request) => (
          <Link to={`/request/${request.id}`} key={request.id}>
            <div
              style={{
                border: "2px solid black",
                width: "500px",
                margin: "10px",
                padding: "10px",
              }}
            >
              <p>Id заяви: {request.id}</p>
              <p>Повне ім'я: {request.fullName}</p>
              <p>Статус: {request.status}</p>
              <p>Заявку подано: {request.created_at}</p>
              <p>Автор заяви Id: {request.user_id}</p>
              <p>Перейти</p>
            </div>
          </Link>
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

export default RequestsHistory;
