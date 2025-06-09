import React, { useState, useEffect, useRef } from "react";
import { SITE_TITLE } from "../../siteTittle";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { io } from "socket.io-client";
import "../../../styles/messages.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

const MessageDiv = () => {
  const { auctionId } = useParams();
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const [lotTitle, setLotTitle] = useState(null);

  useEffect(() => {
    const fetchReceiverId = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/lot/${auctionId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const lot = await res.json();

        const bidRes = await fetch(
          `http://localhost:3000/api/lot/${auctionId}/bids`
        );
        const bids = await bidRes.json();

        let winnerId = null;

        if (bids.length > 0 && lot.status === "ended") {
          const highestBid = bids.reduce((max, bid) =>
            bid.amount > max.amount ? bid : max
          );
          winnerId = highestBid.user_id;
        }

        if (user?.id === lot.creator.userId) {
          setReceiverId(winnerId);
        } else {
          setReceiverId(lot.creator.userId);
        }

        setLotTitle(lot.title);
      } catch (err) {
        console.error("Помилка завантаження лоту/ставок:", err);
      }
    };

    if (user) fetchReceiverId();
  }, [auctionId, user]);

  useEffect(() => {
    if (lotTitle && lotTitle.trim() !== "") {
      document.title = `${SITE_TITLE} - повідомлення "${lotTitle}" `;
    } else {
      document.title = `${SITE_TITLE} - Такого лоту не існує!`;
    }

    return () => {
      document.title = SITE_TITLE;
    };
  }, [lotTitle]);

  useEffect(() => {
    if (!auctionId) return;
    socket.emit("joinRoom", auctionId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [auctionId]);

  useEffect(() => {
    const getMessages = async () => {
      if (!auctionId || !receiverId || !user) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/messages/${auctionId}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Помилка отримання повідомлень:", error);
      }
    };

    getMessages();
  }, [auctionId, receiverId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    console.log("receiverId:", receiverId);
    if (!input.trim() || !receiverId || !auctionId) {
      console.warn("Недостатньо даних для надсилання");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          auction_id: auctionId,
          receiver_id: receiverId,
          message: input,
        }),
      });

      if (!res.ok) throw new Error("Помилка відправки");

      setInput("");
    } catch (err) {
      console.error("Помилка відправки:", err);
    }
  };

  return (
    <div className="page-for-messages">
      <div className="messages-block">
        <div className="new-message-block">
          {messages.map((msg) => (
            <div key={msg.id} className="message-wrapper">
              <div
                className={`message ${
                  msg.sender_id === user.id ? "sent" : "received"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className="send-message-block">
          <input
            type="text"
            className="input-message"
            placeholder="Введіть повідомлення..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <div className="two-buttons-message-page">
            <button className="send-message-button" onClick={sendMessage}>
              Відправити повідомлення
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDiv;
