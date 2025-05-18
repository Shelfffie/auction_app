import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/authContext";
import { useParams, Link } from "react-router-dom";
import io from "socket.io-client";

import "../../../styles/lot-id.css";

const BidsContainer = ({ creatorId, auctionStatus, lotId, startedPrice }) => {
  const rounded = Math.round(startedPrice);
  const { user } = useAuth();
  const [value, setValue] = useState(rounded);
  const [bids, setBids] = useState([]);
  const [minAmount, setMinAmount] = useState(rounded);
  const [winner, setWinner] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!lotId) return;
    socketRef.current = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", lotId);

      socketRef.current.on("newBid", (bid) => {
        if (!bid || !bid.auction_id) return;

        if (String(bid.auction_id) === String(lotId)) {
          setBids((prev) => [...prev, { ...bid, amount: Number(bid.amount) }]);
          setMinAmount((prev) => Math.max(prev, Number(bid.amount)));
          setValue((prev) => Math.max(prev, Number(bid.amount)));
        }
      });
    });

    const fetchBids = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/lot/${lotId}/bids`
        );
        if (!response.ok) throw new Error("Не вдалося отримати ставки");
        const data = await response.json();
        setBids(data);

        if (data.length > 0 && auctionStatus === "ended") {
          const highestBid = data.reduce((max, bid) =>
            bid.amount > max.amount ? bid : max
          );
          setWinner(highestBid);
        }

        const maxBid =
          data.length > 0
            ? Math.max(...data.map((bid) => bid.amount))
            : rounded;
        setMinAmount(maxBid);
        setValue(maxBid);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBids();

    return () => {
      socketRef.current.disconnect();
    };
  }, [lotId]);

  const makeBid = async (e) => {
    e.preventDefault();

    if (Number(value) <= minAmount) {
      alert(
        "Cтавка має бути більше поточного або мінімального значення ставки!"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/lot/${lotId}/bids`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            auction_id: lotId,
            amount: value,
          }),
        }
      );
      if (!response) throw new Error("Помилка створення ставки");

      alert("Ставку зроблено!");
    } catch (error) {
      console.error(error);
      alert("Не вдалося зробити ставку");
    }
  };

  const increase = () => setValue((v) => v + 5);
  const decrease = () => setValue((v) => Math.max(0, v - 5));
  const scrollBoxRef = useRef(null);

  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    }
  }, [bids]);

  return (
    <>
      {auctionStatus === "pending" && (
        <div className="container-for-bids">
          <p>Аукціон ще не почався.</p>
        </div>
      )}

      {(auctionStatus === "active" || auctionStatus === "ended") && (
        <div className="container-for-bids">
          <p>Історія ставок</p>
          <div className="scroll-bids-list" ref={scrollBoxRef}>
            {bids.length > 0 ? (
              bids.map((bid) => (
                <div key={bid.id}>
                  <p>
                    Користувач {bid?.user_bid?.name || "Невідомий"} зробив
                    ставку {bid.amount} грн
                  </p>
                  <p className="data-bid">
                    Ставку зроблено:{" "}
                    {new Date(bid.created_at).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </div>
              ))
            ) : auctionStatus !== "ended" ? (
              <h2>Ставок ще немає</h2>
            ) : null}

            {auctionStatus === "ended" && (
              <>
                {winner ? (
                  <div className="winner-div">
                    <h3>Переможець:</h3>
                    <p>
                      Користувач{" "}
                      {winner?.user_bid?.name || "Невідомий користувач"} зі
                      ставкою <strong>{winner.amount} грн</strong>
                    </p>
                  </div>
                ) : (
                  <div className="winner-div">
                    <h3>Переможця немає</h3>
                    <p>Ніхто не зробив жодної ставки.</p>
                  </div>
                )}

                {winner &&
                  (user.id === winner?.user_bid?.id ||
                    user.id === creatorId) && (
                    <Link to={`/lot/${lotId}/messages`}>
                      <button className="go-to-chat">
                        Перейти в чат з{" "}
                        {user.id === winner?.user_bid?.id
                          ? "організатором"
                          : "переможцем"}
                      </button>
                    </Link>
                  )}
              </>
            )}
          </div>

          {user?.id && user.id !== creatorId && auctionStatus !== "ended" && (
            <div>
              <form
                className="make-bid-container"
                method="POST"
                onSubmit={makeBid}
              >
                <p>Введіть ставку:</p>
                <div>
                  <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= minAmount}
                    className="plus-minus-button"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={value}
                    className="set-bid-value"
                    onChange={(e) => setValue(Number(e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={increase}
                    className="plus-minus-button"
                  >
                    +
                  </button>
                </div>
                <button className="make-bid">Зробити ставку</button>
              </form>
            </div>
          )}

          {auctionStatus === "cancelled" && (
            <div className="container-for-bids">
              <p>Аукціон відмінений.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BidsContainer;
