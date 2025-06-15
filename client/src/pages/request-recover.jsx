import { React, useEffect, useState } from "react";
import { useAuth } from "../hooks/authContext";
import "../../styles/error-page.css";
import "../../styles/banned-deleted.css";
import ConfirmModal from "../components/alertModal";

const RequestRecoveryPage = () => {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    document.title = "Апеляція";
  }, []);

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user-appeal", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) {
          setAppeals([]);
        } else {
          const data = await response.json();
          setAppeals(data.appeals || []);
        }
      } catch (error) {
        console.error("Error fetching appeals:", error);
        setAppeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppeals();
  }, [token]);

  const hadnleSubmit = async (e) => {
    e.preventDefault();

    if (!description) {
      setShowAlertMessage("Ви не можете відправити пусту заявку!");
      setShowAlert(true);
      return;
    }

    setShowConfirm(true);
  };

  const requestToRecover = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/new-recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ description }),
      });
      console.log(await response.json());
      if (!response.ok) {
        throw new Error("Не вдалося надіслати заявку");
      }
      setShowAlertMessage("Заявку надіслано успішно! Слідкуйте за оновленням.");
      setShowAlert(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Помилка надсилання заявки:", error);
      setShowAlertMessage("Виникла помилка при надсиланні заявки");
      setShowAlert(true);
    }
  };

  const statusLabels = {
    pending: "В обробці...",
    rejected: "Відхилено",
  };

  const appealsCount = appeals.length;
  const lastAppeal = appealsCount > 0 ? appeals[0] : null;

  if (loading) {
    return (
      <div>
        <p>Завантаження...</p>
      </div>
    );
  }

  if (appeals.length >= 3) {
    return (
      <div className="limited-div">
        <h1>Ваш акаунт заблоковано!</h1>
        <p>Ви досягли ліміту на кількість заявок (3)!</p>

        {lastAppeal?.status === "pending" ? (
          <h2>Ваша остання заявка в обробці...</h2>
        ) : (
          <h2>Ви більше не можете надсилати заявок.</h2>
        )}
        <div className="appeal-div">
          <p>Заявка: {lastAppeal?.description}</p>
          <p>Статус: {statusLabels[lastAppeal?.status] || "В обробці..."}</p>
        </div>
        {showAlert && (
          <ConfirmModal
            tittle=" "
            message={showAlertMessage}
            onConfirm={() => setShowAlert(false)}
            showCancel={false}
          />
        )}
        {showConfirm && (
          <ConfirmModal
            tittle="Підтвердження"
            message="Відправити заявку?"
            onConfirm={() => {
              setShowConfirm(false);
              requestToRecover();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    );
  }

  if (lastAppeal?.status === "pending") {
    return (
      <div className="limited-div">
        <h2>Ваша заявка в обробці...</h2>
        <div className="appeal-div">
          <p>Заявка: {lastAppeal?.description}</p>
          <p>Статус: {statusLabels[lastAppeal?.status] || "В обробці..."}</p>
        </div>
      </div>
    );
  }
  if (lastAppeal?.status !== "pending" && appeals.length < 3) {
    return (
      <>
        <div className="limited-div">
          {lastAppeal?.status === "rejected" ? (
            <h2>Ваша заявка відхилена</h2>
          ) : (
            <h2>Вас знову заблоковано! Ваша остання заявка:</h2>
          )}

          <div className="appeal-div">
            <h2>Заявка:</h2>
            <p> {lastAppeal?.description}</p>
            <h2>Статус: </h2>
            <p>{statusLabels[lastAppeal?.status] || "Відхилено"}</p>
          </div>
          <h2>Ви можете надіслати ще одну заявку:</h2>
          <form
            method="POST"
            onSubmit={hadnleSubmit}
            className="another-one-request"
          >
            <textarea
              cols="30"
              rows="10"
              placeholder="Опишіть, чому ви вважаєте, що ваш акаунт було заблоковано помилково, або чому його слід відновити. Вкажіть деталі ситуації, що сталося, та будь-які пояснення, які можуть допомогти адміністрації переглянути рішення."
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-recovery"
              required
            />
            <button className="button-del-lim">Надіслати заявку</button>
          </form>
        </div>
        {showAlert && (
          <ConfirmModal
            tittle=" "
            message={showAlertMessage}
            onConfirm={() => setShowAlert(false)}
            showCancel={false}
          />
        )}
        {showConfirm && (
          <ConfirmModal
            tittle="Підтвердження"
            message="Відправити заявку?"
            onConfirm={() => {
              setShowConfirm(false);
              requestToRecover();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </>
    );
  }

  if (appeals.length === 0) {
    return (
      <form method="POST" onSubmit={hadnleSubmit}>
        <div className="limited-div">
          <h1>Ваш акаунт заблоковано!</h1>
          <p>
            Якщо ви вважаєте, що блокування сталося помилково, або у вас є
            підстави для апеляції — заповніть форму нижче. Ми розглянемо вашу
            заявку якнайшвидше.
          </p>
          <textarea
            cols="30"
            rows="10"
            placeholder="Опишіть, чому ви вважаєте, що ваш акаунт було заблоковано помилково, або чому його слід відновити. Вкажіть деталі ситуації, що сталося, та будь-які пояснення, які можуть допомогти адміністрації переглянути рішення."
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-recovery"
            required
          />
          <button className="button-del-lim">Надіслати заявку</button>
        </div>
        {showAlert && (
          <ConfirmModal
            tittle=" "
            message={showAlertMessage}
            onConfirm={() => setShowAlert(false)}
            showCancel={false}
          />
        )}
        {showConfirm && (
          <ConfirmModal
            tittle="Підтвердження"
            message="Відправити заявку?"
            onConfirm={() => {
              setShowConfirm(false);
              requestToRecover();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </form>
    );
  }
};

export default RequestRecoveryPage;
