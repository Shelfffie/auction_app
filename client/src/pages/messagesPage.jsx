import Header from "./../components/header.jsx";
import MessageDiv from "../components/auctions/messages.jsx";
import LotDiv from "../components/auctions/mini-lot-for-messages.jsx";

function MessagePage() {
  return (
    <div className="background">
      <Header />
      <div className="div-for-raw">
        <LotDiv />
        <MessageDiv />
      </div>
    </div>
  );
}

export default MessagePage;
