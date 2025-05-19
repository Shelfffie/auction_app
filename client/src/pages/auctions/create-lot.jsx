import { useEffect } from "react";
import { SITE_TITLE } from "../../siteTittle";
import CreateLot from "../../components/auctions/create-a-lot";
import Header from "../../components/header";
import "../../../styles/phone-for-page.css";

function CreateLotPage() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Створити лот`;
  }, []);
  return (
    <div className="background">
      <Header />
      <CreateLot />
    </div>
  );
}

export default CreateLotPage;
