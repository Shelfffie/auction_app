import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/authContext";
import { useParams } from "react-router-dom";

import "../../../styles/lot-id.css";

const AuctionControl = ({
  creatorId,
  onEdit,
  onToggleStatus,
  auctionStatus,
  onFinish,
  onDelete,
}) => {
  const { user } = useAuth();

  const isAdmin = user?.user_role === "admin";
  const isOwner = user.id === creatorId;

  const showStatusButtons =
    (isAdmin || isOwner) &&
    (auctionStatus === "active" ||
      auctionStatus === "cancelled" ||
      auctionStatus === "pending");

  const showEdit =
    (isAdmin && auctionStatus !== "cancelled") ||
    (isAdmin && auctionStatus === "ended") ||
    (isOwner && auctionStatus !== "ended" && auctionStatus !== "active");

  const showDelete = isOwner || isAdmin || auctionStatus === "ended";

  return (
    <div className="control-panel-container">
      {showEdit && <button onClick={onEdit}>Редагувати лот</button>}

      {showStatusButtons && auctionStatus !== "ended" && (
        <>
          <button onClick={onToggleStatus}>
            {auctionStatus === "cancelled"
              ? "Відновити аукціон"
              : "Відмінити аукціон"}
          </button>
          <button onClick={onFinish}>Завершити аукціон</button>
        </>
      )}

      {showDelete && <button onClick={onDelete}>Видалити лот</button>}
    </div>
  );
};

export default AuctionControl;
