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
  const canEdit = isAdmin || (isOwner && auctionStatus !== "ended");
  return (
    <div className="control-panel-container">
      {canEdit && (
        <>
          <button onClick={onEdit}>Редагувати лот</button>
          {isAdmin && auctionStatus !== "ended" && (
            <>
              <button onClick={onToggleStatus}>
                {auctionStatus === "cancelled"
                  ? "Відновити аукціон"
                  : "Відмінити аукціон"}
              </button>
              <button onClick={onFinish}> Завершити аукціон</button>
            </>
          )}
          <button onClick={onDelete}>Видалити лот</button>
        </>
      )}
    </div>
  );
};

export default AuctionControl;
