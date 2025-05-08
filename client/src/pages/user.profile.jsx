import { useState } from "react";
import Header from "./../components/header.jsx";
import UserProfilePage from "../components/profile/another-users-profile.jsx";

function AnotherUserProfile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <UserProfilePage />
    </>
  );
}

export default AnotherUserProfile;
