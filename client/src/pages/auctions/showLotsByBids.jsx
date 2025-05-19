import { useEffect } from "react";
import { SITE_TITLE } from "../../siteTittle";
import Header from "../../components/header";
import ShowLotsByBids from "../../components/auctions/lots/showLotsByBids";
import "../../../styles/phone-for-page.css";

function ShowLotsByBidsPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Лоти, в яких ви берете участь`;
  }, []);
  return (
    <>
      <Header />
      <ShowLotsByBids />
    </>
  );
}

export default ShowLotsByBidsPage;
