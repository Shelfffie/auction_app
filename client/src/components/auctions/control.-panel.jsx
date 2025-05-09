import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/authContext";
import { useParams } from "react-router-dom";

import "../../../styles/lot-id.css";

const AuctionControl = ({ creatorId }) => {
  return (
    <div className="control-panel-container">
      <button>Редагувати лот</button>
      <button>Видалити лот</button>
      <button>Завершити аукціон</button>
    </div>
  );
};

export default AuctionControl;
