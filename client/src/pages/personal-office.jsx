import { useState } from "react";
import Header from "./../components/header.jsx";
import ProfilePage from "./../components/profile/icon-and-info.jsx";
import ProfileButtons from "./../components/profile/profile-buttons.jsx";
import "../../styles/phone-for-page.css";

function Profile() {
  return (
    <div className="background">
      <Header />
      <ProfilePage />
      <ProfileButtons />
    </div>
  );
}

export default Profile;
