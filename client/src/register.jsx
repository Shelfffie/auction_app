import { useState } from "react";
import SignUpForm from "./components/register-file";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SignUpForm />
    </>
  );
}
