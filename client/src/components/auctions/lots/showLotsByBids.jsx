import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/authContext";
import defaulImage from "../../../../pics/null-donut.png";
import { Link } from "react-router-dom";
import "../../../../styles/all-lots-show.css";

function ShowLotsByBids() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const { user } = useAuth();

  const fetchLots = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/participated/${user.id}?page=${page}`
      );
      const data = await response.json();
      setLots(data.lots);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Помилка при завантаженні лотів:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchLots(page);
    }
  }, [page, user]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="show-lots background">
      <div className="space-div">
        <h1 className="tittle-look-lots">Лоти, в яких ви берете участь</h1>
      </div>
      <div className="lots-panel">
        {loading ? (
          <p className="looks-for-lots">Завантаження..</p>
        ) : lots.length === 0 ? (
          <p className="looks-for-lots">Наразі немає актуальних лотів</p>
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

                <img
                  src={
                    lot?.creator?.profile_icon
                      ? `http://localhost:3000${lot?.creator?.profile_icon}`
                      : defaulImage
                  }
                  alt=""
                  className="user-pic-img cell cell4"
                />

                <h4 className="cell cell5">{lot?.creator?.name}</h4>
                <p className="cell cell6">
                  На сайті з{" "}
                  {lot?.creator?.created_at
                    ? new Date(lot.creator.created_at).toLocaleDateString(
                        "uk-UA",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "Дата створення"}
                </p>

                <p className="info-about-lot-description cell cell3">
                  {lot.description}
                </p>

                <p className="cell cell7">
                  Аукціон закінчиться{" "}
                  {lot.end_time
                    ? new Date(lot.end_time).toLocaleDateString("uk-UA", {
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })
                    : "Дата невідома"}
                </p>

                <h4 className="cell cell9">
                  Початкова ціна: {lot.start_price} грн
                </h4>
                <h4 className="cell cell10">
                  Остання ставка: {lot.bids[0]?.amount} грн
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
export default ShowLotsByBids;
