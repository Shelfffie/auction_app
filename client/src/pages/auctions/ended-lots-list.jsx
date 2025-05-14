import { useState } from "react";
import ShowEndedLots from "../../components/auctions/lots/show-ended-lots";
import Header from "../../components/header";
import "../../../styles/phone-for-page.css";

function EndedLotsPage() {
  return (
    <div className="background">
      <Header />
      <ShowEndedLots />
    </div>
  );
}

export default EndedLotsPage;
