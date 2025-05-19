import { useState } from "react";
import Header from "./../components/header.jsx";
import WonLots from "../components/auctions/lots/showWonLots.jsx";
import "../../styles/phone-for-page.css";

function WonLotsPage() {
  return (
    <>
      <div className="background">
        <Header />
        <WonLots />
      </div>
    </>
  );
}

export default WonLotsPage;
