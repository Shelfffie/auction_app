import { useEffect } from "react";
import { SITE_TITLE } from "../siteTittle";
import Header from "./../components/header.jsx";
import ProfilePage from "./../components/profile/icon-and-info.jsx";
import ProfileButtons from "./../components/profile/profile-buttons.jsx";
import "../../styles/phone-for-page.css";

function Profile() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Особистий кабінет`;
  }, []);
  return (
    <div className="background">
      <Header />
      <ProfilePage />
      <ProfileButtons />
    </div>
  );
}

export default Profile;
