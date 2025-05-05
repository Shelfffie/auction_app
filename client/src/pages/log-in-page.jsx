import { useState } from "react";
import LogInForm from "./../components/sign-up-and-log-in/log-in-form.jsx";

function LogIn() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LogInForm />
    </>
  );
}

export default LogIn;
