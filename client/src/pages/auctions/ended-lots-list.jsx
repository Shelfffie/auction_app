import { useEffect } from "react";
import { SITE_TITLE } from "../../siteTittle";
import ShowEndedLots from "../../components/auctions/lots/show-ended-lots";
import Header from "../../components/header";
import "../../../styles/phone-for-page.css";

function EndedLotsPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Завершені лоти`;
  }, []);
  return (
    <div className="background">
      <Header />
      <ShowEndedLots />
    </div>
  );
}

export default EndedLotsPage;
