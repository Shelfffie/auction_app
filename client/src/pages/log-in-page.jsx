import { useEffect } from "react";
import { SITE_TITLE } from "../siteTittle";
import LogInForm from "./../components/sign-up-and-log-in/log-in-form.jsx";

function LogIn() {
  useEffect(() => {
    document.title = `${SITE_TITLE} - Авторизуватися`;
  }, []);
  return (
    <>
      <LogInForm />
    </>
  );
}

export default LogIn;
