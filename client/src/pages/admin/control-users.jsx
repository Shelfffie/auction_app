import React, { useEffect, useState } from "react";

function UserControl() {
  const [searchId, setSearchId] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "",
    created_at: "",
    updated_at: "",
    lots: [],
  });
  const [notFound, setNotFound] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (searchId.trim() === "") {
      setUserData({
        id: "",
        name: "",
        email: "",
        role: "",
        status: "",
        created_at: "",
        updated_at: "",
      });
      setNotFound(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
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
          setUserData({
            id: "",
            name: "",
            email: "",
            role: "",
            status: "",
            created_at: "",
            updated_at: "",
          });
          setNotFound(true);
        }
      };

      fetchData();
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [searchId]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEdit = async () => {
    if (!window.confirm("Редагувати?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/controller/user/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалося оновити користувача");
      }

      const updated = await res.json();
      alert("Користувача оновлено");
      setUserData((prev) => ({
        ...prev,
        ...updated,
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Точно видалити користувача?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/controller/user/${userData.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Не вдалося видалити користувача");

      alert("Користувача видалено");
      setUserData({
        id: "",
        name: "",
        email: "",
        role: "",
        status: "",
        created_at: "",
        updated_at: "",
      });
      setSearchId("");
    } catch (error) {
      alert(error.message);
    }
  };

  const dataFormat = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <div style={{ color: "bisque", margin: "50px" }}>
      <h1>КОРИСТУВАЧ</h1>
      <input
        type="text"
        name="id"
        placeholder="Введіть ID користувача"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      {notFound && <p style={{ color: "red" }}>Такого користувача не існує</p>}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label name="id">
          ID:
          <input name="id" type="text" value={userData.id} disabled />
        </label>
        <label name="user-name">
          Name:
          <input
            name="user-name"
            value={userData.name}
            onChange={handleChange}
          />
        </label>
        <label name="user-email">
          Email:
          <input
            name="user-email"
            value={userData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Role:
          <select name="role" value={userData.role} onChange={handleChange}>
            <option value="user">user</option>
            <option value="organizer">organizer</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <label>
          Status:
          <select name="status" value={userData.status} onChange={handleChange}>
            <option value="active">active</option>
            <option value="deleted">deleted</option>
            <option value="banned">banned</option>
          </select>
        </label>
        <label name="created_at">
          Created At:
          <input
            name="created_at"
            value={
              userData.created_at
                ? new Date(userData.created_at).toLocaleDateString(
                    "uk-UA",
                    dataFormat
                  )
                : ""
            }
            disabled
          />
        </label>
        <label name="updated_at">
          Updated At:
          <input
            name="updated_at"
            value={
              userData.updated_at
                ? new Date(userData.updated_at).toLocaleDateString(
                    "uk-UA",
                    dataFormat
                  )
                : ""
            }
            disabled
          />
        </label>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button onClick={handleEdit} style={{ marginRight: "20px" }}>
          Зберегти зміни
        </button>
        <button onClick={handleDelete}>Видалити користувача</button>
      </div>
      <h2>Лоти користувача:</h2>
      {userData.id && (
        <div style={{ marginTop: "30px" }}>
          {userData.lots.length === 0 ? (
            <p>Користувач не створював лотів</p>
          ) : (
            <ul>
              {userData.lots.map((lot) => (
                <li key={lot.id}>Лот ID: {lot.id}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default UserControl;
