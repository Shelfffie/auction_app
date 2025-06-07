import { React, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import "../../styles/banned-deleted.css";

const DeletedOrBannedPage = () => {
  const { user, setUser, logOut } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logOut();
    navigate("/");
  };

  const recoverAccount = async () => {
    const confirm = window.confirm("Відновити акаунт?");
    if (!confirm) return;

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
      setUser(updatedUser);

      alert("Аккаунт успішно відновлено!");
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

  if (user?.status === "banned") {
    return (
      <div className="limited-div">
        <h1>Ваш обліковий запис заблоковано!</h1>
        <p>
          Якщо ви вважаєте що це помилка, ви можете подати заявку на
          відновлення.
        </p>
        <button onClick={handleRequestRecovery}>Подати заявку</button>
        <button onClick={handleLogout}>Вийти з облікового запису</button>
      </div>
    );
  }

  if (user?.status === "deleted") {
    return (
      <div className="limited-div">
        <h1>Ваш обліковий запис деактивовано!</h1>
        <p>Ви можете відновити його.</p>
        <button onClick={recoverAccount}>Відновити обліковий запис</button>
        <button onClick={handleLogout}>Вийти з облікового запису</button>
      </div>
    );
  }
};

export default DeletedOrBannedPage;
