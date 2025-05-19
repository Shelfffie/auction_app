import { useEffect } from "react";
import { SITE_TITLE } from "../../siteTittle";
import Header from "../../components/header";
import ShowLots from "../../components/auctions/lots/show-lots";
import "../../../styles/phone-for-page.css";

function ShowLotPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Активні лоти`;
  }, []);
  return (
    <>
      <Header />
      <ShowLots />
    </>
  );
}

export default ShowLotPage;
