import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Перевірка...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Немає токена в URL.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/verify-email?token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setMessage(data.message);
        } else {
          setMessage(data.message || "Помилка підтвердження.");
        }
      } catch (error) {
        setMessage(error.res?.data?.message || "Сталася помилка.");
      }
    };
    verify();
  }, [searchParams]);

  return <div>{message}</div>;
}
