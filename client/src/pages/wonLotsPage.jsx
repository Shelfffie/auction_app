import { useEffect } from "react";
import { SITE_TITLE } from "../siteTittle";
import Header from "./../components/header.jsx";
import WonLots from "../components/auctions/lots/showWonLots.jsx";
import "../../styles/phone-for-page.css";

function WonLotsPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Виграні лоти`;
  }, []);
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
