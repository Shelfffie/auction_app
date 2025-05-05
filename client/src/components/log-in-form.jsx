import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/valid-forms.css";

function LogInForm() {
  const [emailValue, setEmailValue] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

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

  return (
    <div className="all-form">
      <Link to="/">
        <p className="donut-on">DonutON</p>
      </Link>
      <form className="block-for-registation" method="POST">
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
        <button type="submit" className="sign-up-button log-in-margin">
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
