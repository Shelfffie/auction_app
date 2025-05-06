import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/valid-forms.css";
import { useNavigate } from "react-router-dom";

function SuccessSignUp() {
  return (
    <div className="all-form">
      <Link to="/">
        <p className="donut-on">DonutON</p>
      </Link>
      <label>Ви успішно зареєструвались!</label>
      <Link to="/log-in">
        <p className="Log-sign-in">Увійти</p>
      </Link>
    </div>
  );
}

export default SuccessSignUp;
