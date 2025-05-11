import { useState } from "react";
import Header from "./../components/header.jsx";
import UserProfilePage from "../components/profile/another-users-profile.jsx";
import "../../styles/phone-for-page.css";

function AnotherUserProfile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="white">
        <Header />
        <UserProfilePage />
      </div>
    </>
  );
}

export default AnotherUserProfile;
