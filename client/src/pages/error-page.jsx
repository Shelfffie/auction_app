import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/error-page.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-div">
      <h1>Упс!</h1>
      <p>Такої сторінки не існує!</p>
      <button onClick={goBack}>Повернутись</button>
    </div>
  );
};

export default ErrorPage;
