import { useState } from "react";
import Header from "../../components/header";
import ShowLots from "../../components/auctions/lots/show-lots";
import "../../../styles/phone-for-page.css";

function ShowLotPage() {
  return (
    <>
      <Header />
      <ShowLots />
    </>
  );
}

export default ShowLotPage;
