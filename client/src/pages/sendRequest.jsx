import { useEffect } from "react";
import { SITE_TITLE } from "../siteTittle";
import UserProfilePage from "../components/profile/another-users-profile.jsx";
import NewRequest from "../components/requests.jsx";
import "../../styles/phone-for-page.css";

function SendRequestPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Заявка на зміну статусу`;
  }, []);
  return (
    <>
      <Header />
      <NewRequest />
    </>
  );
}

export default SendRequestPage;
