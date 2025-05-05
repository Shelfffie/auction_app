import { useState } from "react";
import SignUpForm from "./../components/register-file";

function SignUp() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SignUpForm />
    </>
  );
}

export default SignUp;
