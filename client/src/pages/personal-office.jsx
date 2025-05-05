import { useState } from "react";
import Header from "./../components/header.jsx";
import ProfilePage from "./../components/profile/icon-and-info.jsx";
import ProfileButtons from "./../components/profile/profile-buttons.jsx";

function Profile() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <ProfilePage />
      <ProfileButtons />
    </>
  );
}

export default Profile;
