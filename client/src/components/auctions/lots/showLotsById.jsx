import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/authContext";
import defaulImage from "../../../../pics/null-donut.png";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../../../styles/all-lots-show.css";

function ShowLotsById() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const { user } = useAuth();
  const { userId } = useParams();

  const fetchLots = async (page) => {
    const currentUserId = userId || user?.id;
    try {
      const response = await fetch(
        `http://localhost:3000/api/creator/${currentUserId}?page=${page}`
      );
      const data = await response.json();

      if (!Array.isArray(data.lots)) {
        console.error("Невірний формат лотів:", data);
        setLots([]);
        return;
      }

      setLots(data.lots);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Помилка при завантаженні лотів:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const auctionStatus = {
    pending: "Очікується...",
    active: "Активний",
    ended: "Завершений",
    cancelled: "Скасований",
  };

  return (
    <div className="show-lots background">
      <div className="space-div">
        <h1 className="tittle-look-lots">
          {userId
            ? lots.length > 0
              ? `Лоти користувача ${lots[0].creator?.name || "невідомо"}`
              : "Немає лотів"
            : "Мої лоти"}
        </h1>
      </div>
      <div className="lots-panel">
        {loading ? (
          <p className="looks-for-lots">Завантаження..</p>
        ) : lots.length === 0 ? (
          <p className="looks-for-lots">Поки немає лотів</p>
        ) : (
          lots.map((lot) => (
            <Link to={`/lot/${lot.id}`} key={lot.id}>
              <div className="lot-item-show">
                <h3 className="cell cell1">{lot.title}</h3>

                <img
                  src={`http://localhost:3000${lot?.image_url}`}
                  alt={lot.title}
                  className="lot-item-img cell cell2"
                />

                <p className="info-about-lot-description cell cell3">
                  {lot.description}
                </p>

                <h4 className="cell cell7">
                  Статус: {auctionStatus[lot.status]}
                </h4>
                {!["ended", "cancelled"].includes(lot.status) && (
                  <p className="cell cell8">
                    {lot.status === "pending"
                      ? "Аукціон почнеться " +
                        (lot.start_time
                          ? new Date(lot.start_time).toLocaleDateString(
                              "uk-UA",
                              {
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )
                          : "Дата невідома")
                      : "Аукціон закінчиться " +
                        (lot.end_time
                          ? new Date(lot.end_time).toLocaleDateString("uk-UA", {
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })
                          : "Дата невідома")}
                  </p>
                )}

                <h4 className="cell cell9">
                  Початкова ціна: {lot.start_price} грн
                </h4>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          className="page-button arrow"
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
              className={`page-button ${page === pageNum ? "active" : ""}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className="page-button arrow"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
export default ShowLotsById;
