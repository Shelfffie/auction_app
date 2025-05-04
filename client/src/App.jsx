import { useState } from "react";
import Header from "./components/header.jsx";
import AboutApp from "./components/about-platform.jsx";
import CurrentLots from "./components/current-lots.jsx";
import LookAddButtons from "./components/add-look-more.jsx";
import AboutAuctions from "./components/about-auctions.jsx";
import FAQ from "./components/FAQ-container.jsx";
import SignUpForm from "./components/register-file";
import LogInForm from "./components/log-in-form.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/*<Header />
      <AboutApp />
      <CurrentLots />
      <LookAddButtons />
      <AboutAuctions />
      <FAQ />*/}
      <LogInForm />
    </>
  );
}

export default App;
