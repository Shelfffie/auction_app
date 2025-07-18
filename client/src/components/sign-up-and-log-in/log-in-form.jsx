import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/valid-forms.css";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../alertModal";

function LogInForm() {
  const [emailValue, setEmailValue] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);

  const passwordCheck = /^(?=.*[а-яa-zA-Z])(?=.*\d).{8,}$/;
  const emailCheck = /^[\w.]+@[a-z]+\.[a-z]{2,5}$/;

  const validateEmail = () => {
    const trimmed = emailValue.trim();

    if (trimmed === "") {
      setEmailStatus("invalid");
      setEmailMessage("Поле не може бути порожнім.");
    } else if (emailCheck.test(trimmed)) {
      setEmailStatus("valid");
      setEmailMessage("");
    } else {
      setEmailStatus("invalid");
      setEmailMessage("Будь ласка, введіть правильний email");
    }
  };

  const validatePassword = () => {
    const trimmed = passwordValue.trim();

    if (trimmed === "") {
      setPasswordStatus("invalid");
      setPasswordMessage("Поле не може бути порожнім.");
    } else if (passwordCheck.test(trimmed)) {
      setPasswordStatus("valid");
      setPasswordMessage("");
    } else {
      setPasswordStatus("invalid");
      setPasswordMessage(
        "Пароль повинен бути не менше 8 символів, містити цифри та букви."
      );
    }
  };

  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailValue("");
        setPasswordValue("");
        localStorage.setItem("token", data.token);
        setAlertMessage("Вхід успішний!");
        setShowAlert(true);
      } else {
        console.log("Response error data:", data);
      }
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  return (
    <div className="all-form">
      {showAlert && (
        <ConfirmModal
          tittle=" "
          message={alertMessage}
          onConfirm={() => {
            setShowAlert(false);
            navigate("/");
            window.location.reload();
          }}
          showCancel={false}
        />
      )}
      <Link to="/">
        <p className="donut-on">DonutON</p>
      </Link>
      <form className="block-for-sign-up" method="POST">
        <label htmlFor="email">Введіть ваш email-адрес</label>
        <input
          type="email"
          id="email"
          autoComplete="req-pass"
          placeholder="Введіть email"
          value={emailValue}
          onChange={(event) => setEmailValue(event.target.value)}
          onBlur={validateEmail}
          className={`input ${emailStatus}`}
          required
        />
        <p className="validation-message">{emailMessage}</p>

        <label htmlFor="new-password">Введіть пароль</label>
        <input
          id="new-password"
          name="user-new-pas"
          type="password"
          autoComplete="new-password"
          value={passwordValue}
          onChange={(event) => setPasswordValue(event.target.value)}
          onBlur={validatePassword}
          placeholder="Enter your password"
          className={`input ${passwordStatus}`}
          required
        />
        <p className="validation-message">{passwordMessage}</p>
        <button
          type="submit"
          className="sign-up-button log-in-margin"
          onClick={handleLogIn}
        >
          Увійти
        </button>
      </form>
      <label>Не маєте облікового запису?</label>
      <Link to="/sign-up">
        <p className="Log-sign-in">Зареєструватися</p>
      </Link>
    </div>
  );
}

export default LogInForm;
