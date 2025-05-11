import { useState } from "react";
import CreateLot from "../../components/auctions/create-a-lot";
import Header from "../../components/header";
import "../../../styles/phone-for-page.css";

function CreateLotPage() {
  return (
    <div className="background">
      <Header />
      <CreateLot />
    </div>
  );
}

export default CreateLotPage;
