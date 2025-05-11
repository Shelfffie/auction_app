import { useState } from "react";
import Header from "./../components/header.jsx";
import LotId from "../components/auctions/lots/lot-id";
import "../../styles/phone-for-page.css";

function LotPage() {
  return (
    <div className="background">
      <Header />
      <LotId />
    </div>
  );
}

export default LotPage;
