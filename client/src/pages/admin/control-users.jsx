import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserControl() {
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (searchId.trim() === "") {
      setUserData(null);
      setNotFound(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        if (searchId.trim() === "") {
          setUserData(null);
          setNotFound(false);
        }
        try {
          const res = await fetch(
            `http://localhost:3000/api/admin/controller/user/${searchId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Користувача не знайдено");
          const data = await res.json();
          setUserData(data);
          setNotFound(false);
        } catch (error) {
          setUserData(null);
          setNotFound(true);
        }
      };

      fetchData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchId]);

  return (
    <div style={{ color: "cream", margin: "50px" }}>
      <h1>КОРИСТУВАЧ</h1>
      <input
        type="text"
        placeholder="Введіть ID користувача"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      {notFound && <p style={{ color: "red" }}>Такого користувача не існує</p>}
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <li>ID: {userData?.id || ""}</li>
        <li>Name: {userData?.name || ""}</li>
        <li>Email: {userData?.email || ""}</li>
        <li>Role: {userData?.role || ""}</li>
        <li>Status: {userData?.status || ""}</li>
        <li>Created at: {userData?.created_at || ""}</li>
        <li>Updated at: {userData?.updated_at || ""}</li>
      </ul>

      <div style={{ marginTop: "50px" }}>
        <button style={{ marginRight: "50px" }}>Редагувати користувача</button>
        <button>Видалити користувача</button>
      </div>
    </div>
  );
}
export default UserControl;
