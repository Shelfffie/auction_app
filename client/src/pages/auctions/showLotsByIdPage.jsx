import { useState } from "react";
import Header from "../../components/header";
import ShowLotsById from "../../components/auctions/lots/showLotsById";
import "../../../styles/phone-for-page.css";

function ShowLotByIdPage() {
  return (
    <>
      <Header />
      <ShowLotsById />
    </>
  );
}

export default ShowLotByIdPage;
