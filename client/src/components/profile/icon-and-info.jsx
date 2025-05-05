import React, { useState } from "react";
import "./../../../styles/profile.css";

function ProfilePage() {
  return (
    <div className="profile-info">
      <img src="./../../../pics/donut.png" alt="" className="profile-icon" />
      <div className="general-information">
        <p className="big-text">Основна інформація:</p>
        <p>Ім'я</p>x<p className="personal-info">Name</p>
        <p>Прізвище</p>
        <p className="personal-info">Surname</p>
        <p>Номер телефону</p>
        <p className="personal-info">Phone number</p>
      </div>
      <div className="edit-block">
        <p className="edit-profile big-text">Редагувати</p>
      </div>
    </div>
  );
}

export default ProfilePage;
