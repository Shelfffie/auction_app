import React from "react";
import "../../styles/alert.css";

const ConfirmModal = ({
  tittle,
  message,
  onConfirm,
  onCancel,
  showCancel = true,
}) => {
  if (!message || !tittle) return null;

  return (
    <div className="alert-div">
      <div className="alert">
        <h2 className="alert-tittle">{tittle}</h2>
        <div className="alert-tittle-messge">
          <p className="allert-message">{message}</p>
        </div>

        <div className="alert-buttons">
          <button className="alert-button" onClick={onConfirm}>
            Ок
          </button>
          {showCancel && (
            <button className="alert-button" onClick={onCancel}>
              Скасувати
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
