import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/error-page.css";
import { SITE_TITLE } from "../siteTittle";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = `${SITE_TITLE} - Такої сторінки не існує!`;
  }, []);

  return (
    <div className="error-div">
      <h1>Упс!</h1>
      <p>Такої сторінки не існує!</p>
      <button onClick={goBack}>Повернутись</button>
    </div>
  );
};

export default ErrorPage;
