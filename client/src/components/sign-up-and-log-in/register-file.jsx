import React, { useState } from "react";
import "../../../styles/valid-forms.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [nameValue, setNameValue] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [nameStatus, setNameStatus] = useState("");

  const [surnameValue, setSurnameValue] = useState("");
  const [surnameMessage, setSurnameMessage] = useState("");
  const [surnameStatus, setSurnameStatus] = useState("");

  const [emailValue, setEmailValue] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
  const [repeatPasswordMessage, setRepeatPasswordMessage] = useState("");
  const [repeatPasswordStatus, setRepeatPasswordStatus] = useState("");

  const passwordCheck = /^(?=.*[а-яa-zA-Z])(?=.*\d).{8,}$/;
  const emailCheck = /^[\w.]+@[a-z]+\.[a-z]{2,5}$/;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail();
    validatePassword();
    validateRepeatPassword();
    validateName();
    validateSurname();

    const fullName = `${nameValue.trim()} ${surnameValue.trim()}`;

    if (
      nameStatus === "valid" &&
      surnameStatus === "valid" &&
      emailStatus === "valid" &&
      passwordStatus === "valid" &&
      repeatPasswordStatus === "valid"
    ) {
      console.log("Sending registration request...");
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            name: fullName,
          }),
        });

        const data = await response.json();
        console.log("Response from server:", data);

        if (response.ok) {
          alert("Реєстрація успішна!");
          setEmailValue("");
          setPasswordValue("");
          setRepeatPasswordValue("");
          setNameValue("");
          setSurnameValue("");

          navigate("/");
        } else {
          alert(data.message || "Authenfication error");
        }
      } catch (error) {
        console.error("Помилка при запиті", error);
      }
    }
  };

  const validateName = () => {
    const trimmed = nameValue.trim();
    if (trimmed === "") {
      setNameMessage("Поле не може бути порожнім.");
      setNameStatus("invalid");
      return false;
    } else if (trimmed.length < 2) {
      setNameMessage("Ім'я має містити щонайменше 2 символи.");
      setNameStatus("invalid");
      return false;
    }

    setNameMessage("");
    setNameStatus("valid");
    return true;
  };

  const validateSurname = () => {
    const trimmed = surnameValue.trim();
    if (trimmed === "") {
      setSurnameMessage("Поле не може бути порожнім.");
      setSurnameStatus("invalid");
      return false;
    } else if (trimmed.length < 2) {
      setSurnameMessage("Ім'я має містити щонайменше 2 символи.");
      setSurnameStatus("invalid");
      return false;
    }

    setSurnameMessage("");
    setSurnameStatus("valid");
    return true;
  };

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

  const validateRepeatPassword = () => {
    const trimmed = repeatPasswordValue.trim();

    if (trimmed === "") {
      setRepeatPasswordStatus("invalid");
      setRepeatPasswordMessage("Поле не може бути порожнім.");
    } else if (repeatPasswordValue === passwordValue) {
      setRepeatPasswordStatus("valid");
      setRepeatPasswordMessage("");
    } else {
      setRepeatPasswordStatus("invalid");
      setRepeatPasswordMessage("Паролі не співпадають.");
    }
  };

  return (
    <div className="all-form">
      <Link to="/">
        <p className="donut-on">DonutON</p>
      </Link>
      <form
        className="block-for-registation"
        onSubmit={handleSubmit}
        method="POST"
      >
        <div>
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
          <label htmlFor="confirm-user-pas">Повторіть введений пароль</label>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            className="fake-pass"
          />
          <input
            id="confirm-user-pas"
            type="password"
            name="confirm-user-pas"
            autoComplete="new-password"
            value={repeatPasswordValue}
            onChange={(event) => setRepeatPasswordValue(event.target.value)}
            onBlur={validateRepeatPassword}
            placeholder="Enter your password"
            className={`input ${repeatPasswordStatus}`}
            required
          />
          <p className="validation-message">{repeatPasswordMessage}</p>
        </div>
        <div>
          {" "}
          <label htmlFor="name">Введіть ваше ім’я</label>
          <input
            type="text"
            id="name"
            placeholder="Введіть ім’я"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={validateName}
            className={`input ${nameStatus}`}
          />
          <p className="validation-message">{nameMessage}</p>
          <label htmlFor="surname">Введіть ваше прізвище</label>
          <input
            type="text"
            id="surname"
            placeholder="Введіть прізвище"
            value={surnameValue}
            onChange={(e) => setSurnameValue(e.target.value)}
            onBlur={validateSurname}
            className={`input ${surnameStatus}`}
          />
          <p className="validation-message">{surnameMessage}</p>
        </div>
        <button type="submit" className="sign-up-button">
          Зареєструватися
        </button>
      </form>
      <label>Вже маєте обліковий запис?</label>
      <Link to="/log-in">
        <p className="Log-sign-in">Увійти</p>
      </Link>
    </div>
  );
};

export default SignUpForm;
