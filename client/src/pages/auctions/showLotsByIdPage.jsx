import { useEffect } from "react";
import { SITE_TITLE } from "../../siteTittle";
import Header from "../../components/header";
import ShowLotsById from "../../components/auctions/lots/showLotsById";
import "../../../styles/phone-for-page.css";

function ShowLotByIdPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Ваші лоти`;
  }, []);
  return (
    <>
      <Header />
      <ShowLotsById />
    </>
  );
}

export default ShowLotByIdPage;
