import { useState } from "react";
import Header from "../../components/header";
import ShowLotsByBids from "../../components/auctions/lots/showLotsByBids";
import "../../../styles/phone-for-page.css";

function ShowLotsByBidsPage() {
  return (
    <>
      <Header />
      <ShowLotsByBids />
    </>
  );
}

export default ShowLotsByBidsPage;
