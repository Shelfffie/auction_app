import { useEffect } from "react";
import { SITE_TITLE } from "../siteTittle";
import SignUpForm from "./../components/sign-up-and-log-in/register-file";

function SignUp() {
  useEffect(() => {
    document.title = `${SITE_TITLE}  - Зареєструватися`;
  }, []);
  return (
    <>
      <SignUpForm />
    </>
  );
}

export default SignUp;
