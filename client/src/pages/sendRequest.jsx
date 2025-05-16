import { useState } from "react";
import Header from "./../components/header.jsx";
import UserProfilePage from "../components/profile/another-users-profile.jsx";
import NewRequest from "../components/requests.jsx";
import "../../styles/phone-for-page.css";

function SendRequestPage() {
  return (
    <>
      <Header />
      <NewRequest />
    </>
  );
}

export default SendRequestPage;
