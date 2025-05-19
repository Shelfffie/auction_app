import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/authContext";
import { useParams, Navigate } from "react-router-dom";

const AuthorizedForChatRoute = ({ children }) => {
  const { user } = useAuth();
  const { auctionId } = useParams();
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const resLot = await fetch(
          `http://localhost:3000/api/lot/${auctionId}`
        );
        const lot = await resLot.json();

        if (lot.status !== "ended") {
          setAuthorized(false);
          return;
        }

        const resBids = await fetch(
          `http://localhost:3000/api/lot/${auctionId}/bids`
        );
        const bids = await resBids.json();

        let winnerId = null;
        if (bids.length > 0 && lot.status === "ended") {
          const highestBid = bids.reduce((max, bid) =>
            bid.amount > max.amount ? bid : max
          );
          winnerId = highestBid.user_id;
        }

        const isCreator = user?.id === lot.creator.userId;
        const isWinner = user?.id === winnerId;

        setAuthorized(isCreator || isWinner);
      } catch (err) {
        console.error("Помилка перевірки доступу до чату:", err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) checkAccess();
  }, [auctionId, user]);

  if (loading) return <div>Завантаження...</div>;

  if (!authorized) return <Navigate to={`/lot/${auctionId}`} replace />;

  return children;
};

export default AuthorizedForChatRoute;
