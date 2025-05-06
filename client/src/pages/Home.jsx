import { useState } from "react";
import Header from "./../components/header.jsx";
import AboutApp from "./../components/about-platform.jsx";
import CurrentLots from "./../components/current-lots.jsx";
import LookAddButtons from "./../components/add-look-more.jsx";
import AboutAuctions from "./../components/about-auctions.jsx";
import FAQ from "./../components/FAQ-container.jsx";

function Home() {
  return (
    <>
      <Header />
      <AboutApp />
      <CurrentLots />
      <LookAddButtons />
      <AboutAuctions />
      <FAQ />
    </>
  );
}

export default Home;
