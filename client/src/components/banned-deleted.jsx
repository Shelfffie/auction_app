import { React, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import ConfirmModal from "./alertModal";
import "../../styles/banned-deleted.css";

const DeletedOrBannedPage = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user, setUser, logOut } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const recoverClick = () => {
    setShowConfirm(true);
  };

  const recoverAccount = async () => {
    setShowConfirm(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/recover-deleted",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "active" }),
        }
      );

      if (!response.ok) throw new Error("Не вдалося відновити акаунт");

      const updatedUser = await response.json();

      setTimeout(() => {
        setUser(updatedUser);
      }, 1000);
      setShowAlert(true);
    } catch (error) {
      console.error("Помилка відновлення:", error);
    }
  };

  useEffect(() => {
    if (user?.status === "banned") {
      document.title = "Акаунт заблоковано";
    } else if (user?.status === "deleted") {
      document.title = "Обліковий запис видалено";
    }
  }, [user?.status]);

  const handleRequestRecovery = () => {
    navigate("/request-recovery");
  };

  return (
    <div className="limited-div">
      {showAlert && (
        <ConfirmModal
          tittle=" "
          message="Обліковий запис успішно відновлено!"
          onConfirm={() => setShowAlert(false)}
          showCancel={false}
        />
      )}

      {user?.status === "banned" && (
        <>
          <h1>Ваш обліковий запис заблоковано!</h1>
          <p>
            Якщо ви вважаєте що це помилка, ви можете подати заявку на
            відновлення.
          </p>
          <button onClick={handleRequestRecovery} className="button-del-lim">
            Подати заявку
          </button>
          <button onClick={handleLogout} className="button-del-lim">
            Вийти з облікового запису
          </button>
        </>
      )}

      {user?.status === "deleted" && (
        <>
          <h1>Ваш обліковий запис деактивовано!</h1>
          <p>Ви можете відновити його.</p>
          <button className="button-del-lim" onClick={recoverClick}>
            Відновити обліковий запис
          </button>
          <button className="button-del-lim" onClick={handleLogout}>
            Вийти з облікового запису
          </button>

          {showConfirm && (
            <ConfirmModal
              tittle=" "
              message="Відновити обліковий запис?"
              onConfirm={recoverAccount}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeletedOrBannedPage;
