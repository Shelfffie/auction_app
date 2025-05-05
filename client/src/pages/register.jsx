import { useState } from "react";
import SignUpForm from "./../components/sign-up-and-log-in/register-file";

function SignUp() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SignUpForm />
    </>
  );
}

export default SignUp;
