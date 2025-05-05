//чорновик

/*import React, { useState } from "react";
import "../../../styles/valid-forms.css";
import { Link, useNavigate } from "react-router-dom";

function SignUpFileTwo() {
  const [form, setForm] = useState({
    name: { value: "", status: "", message: "" },
    surname: { value: "", status: "", message: "" },
    email: { value: "", status: "", message: "" },
    password: { value: "", status: "", message: "" },
    repeatPassword: { value: "", status: "", message: "" },
  });

  const passwordCheck = /^(?=.*[а-яa-zA-Z])(?=.*\d).{8,}$/;
  const emailCheck = /^[\w.]+@[a-z]+\.[a-z]{2,5}$/;
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const validateField = (field) => {
    const trimmed = form[field].value.trim();
    let message = "";
    let status = "";

    if (trimmed === "") {
      message = "Поле не може бути порожнім.";
      status = "invalid";
    } else {
      switch (field) {
        case "name":
        case "surname":
          if (trimmed.length < 2) {
            message = "Має містити щонайменше 2 символи.";
            status = "invalid";
          }
          break;
        case "email":
          if (!emailCheck.test(trimmed)) {
            message = "Невірний формат email.";
            status = "invalid";
          }
          break;
        case "password":
          if (!passwordCheck.test(trimmed)) {
            message =
              "Пароль має бути не менше 8 символів і містити літери та цифри.";
            status = "invalid";
          }
          break;
        case "repeatPassword":
          if (trimmed !== form.password.value) {
            message = "Паролі не співпадають.";
            status = "invalid";
          }
          break;
        default:
          break;
      }
    }

    setForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], status, message },
    }));

    return status === "valid";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = ["name", "surname", "email", "password", "repeatPassword"];
    const isAllValid = fields.every((field) => validateField(field));
    if (isAllValid) {
      const fullName = `${form.name.value.trim()} ${form.surname.value.trim()}`;
      console.log("Відправка даних:", {
        email: form.email.value,
        password: form.password.value,
        name: fullName,
      });
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.value,
            password: form.password.value,
            name: fullName,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert("Реєстрація успішна!");
          clearForm();
          navigate("/");
        } else {
          alert(data.message || "Помилка реєстрації");
        }
      } catch (err) {
        console.error("Помилка запиту:", err);
      }
    }
  };

  const clearForm = () => {
    setForm({
      name: { value: "", status: "", message: "" },
      surname: { value: "", status: "", message: "" },
      email: { value: "", status: "", message: "" },
      password: { value: "", status: "", message: "" },
      repeatPassword: { value: "", status: "", message: "" },
    });
  };

  return (
    <div className="all-form">
      <Link to="/">
        <p className="donut-on">DonutON</p>
      </Link>

      <form className="block-for-registation" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Введіть ваш email-адрес</label>
          <input
            type="email"
            id="email"
            placeholder="Введіть email"
            value={form.email.value}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => validateField("email")}
            className={`input ${form.email.status}`}
          />
          <p className="validation-message">{form.email.message}</p>

          <label htmlFor="new-password">Введіть пароль</label>
          <input
            id="new-password"
            type="password"
            placeholder="Введіть пароль"
            value={form.password.value}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={() => validateField("password")}
            className={`input ${form.password.status}`}
          />
          <p className="validation-message">{form.password.message}</p>

          <label htmlFor="repeat-password">Повторіть пароль</label>
          <input
            id="repeat-password"
            type="password"
            placeholder="Повторіть пароль"
            value={form.repeatPassword.value}
            onChange={(e) => updateField("repeatPassword", e.target.value)}
            onBlur={() => validateField("repeatPassword")}
            className={`input ${form.repeatPassword.status}`}
          />
          <p className="validation-message">{form.repeatPassword.message}</p>

          <label htmlFor="name">Ім’я</label>
          <input
            id="name"
            type="text"
            placeholder="Введіть ім’я"
            value={form.name.value}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => validateField("name")}
            className={`input ${form.name.status}`}
          />
          <p className="validation-message">{form.name.message}</p>

          <label htmlFor="surname">Прізвище</label>
          <input
            id="surname"
            type="text"
            placeholder="Введіть прізвище"
            value={form.surname.value}
            onChange={(e) => updateField("surname", e.target.value)}
            onBlur={() => validateField("surname")}
            className={`input ${form.surname.status}`}
          />
          <p className="validation-message">{form.surname.message}</p>
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
}

export default SignUpFileTwo;*/
