import React, { useEffect, useState } from "react";

const emptyLotData = {
  id: "",
  title: "",
  description: "",
  start_price: "",
  start_time: "",
  end_time: "",
  creator_id: "",
  status: "",
  created_at: "",
  updated_at: "",
};

function LotsControl() {
  const [lotIdInput, setlotIdInput] = useState("");
  const [lotData, setLotData] = useState(emptyLotData);
  const [isNotFound, setisNotFound] = useState(false);
  const token = localStorage.getItem("token");
  const dataFormat = { year: "numeric", month: "long", day: "numeric" };

  useEffect(() => {
    if (lotIdInput.trim() === "") {
      setLotData(emptyLotData);
      setisNotFound(false);
      return;
    }
    console.log("Searching for lot ID:", lotIdInput);

    const timeoutId = setTimeout(() => {
      const fetchLots = async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/api/admin/controller/lots/${lotIdInput}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Лот не знайдено");
          const data = await res.json();
          console.log("Fetched data:", data);
          setLotData(data.lot);
          setisNotFound(false);
        } catch (error) {
          setLotData(emptyLotData);
          setisNotFound(true);
        }
      };

      fetchLots();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [lotIdInput]);

  const onInputChange = (e) => {
    setLotData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSaveLot = async () => {
    if (!window.confirm("Редагувати?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/controller/lots/${lotData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: lotData.title,
            description: lotData.description,
            start_price: lotData.start_price,
            start_time: new Date(lotData.start_time).toISOString(),
            end_time: new Date(lotData.end_time).toISOString(),
            status: lotData.status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалося оновити лот");
      }

      const updatedLot = await res.json();
      alert("Лот оновлено");
      setLotData((prev) => ({
        ...prev,
        ...updatedLot,
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  const onDeleteLot = async () => {
    if (!window.confirm("Точно видалити?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/controller/lots/${lotData.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Не вдалося видалити лот");

      alert("Лот видалено");
      setLotData({
        id: "",
        title: "",
        description: "",
        start_price: "",
        start_time: "",
        end_time: "",
        creator_id: "",
        status: "",
        created_at: "",
        updated_at: "",
        creator: "",
      });
      setlotIdInput("");
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  return (
    <div style={{ color: "bisque", margin: "50px" }}>
      <h1>ЛОТ</h1>
      <input
        type="text"
        name="input"
        placeholder="Введіть ID лоту"
        value={lotIdInput}
        onChange={(e) => setlotIdInput(e.target.value)}
      />
      {isNotFound && <p style={{ color: "red" }}>Такого лота не існує</p>}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label>
          ID:
          <input type="text" name="id" value={lotData.id || ""} disabled />
        </label>

        <label>
          Назва:
          <input
            type="text"
            name="title"
            value={lotData.title || ""}
            onChange={onInputChange}
          />
        </label>

        <label>
          Опис:
          <textarea
            name="description"
            value={lotData.description || ""}
            onChange={onInputChange}
            rows={6}
            cols={50}
          />
        </label>

        <label>
          Стартова ціна:
          <input
            type="text"
            name="start_price"
            value={lotData.start_price || ""}
            onChange={onInputChange}
          />
        </label>

        <label>
          Початок:
          <input
            type="datetime-local"
            name="start_time"
            value={formatDateForInput(lotData.start_time) || ""}
            onChange={onInputChange}
          />
        </label>

        <label>
          Кінець:
          <input
            type="datetime-local"
            name="end_time"
            value={formatDateForInput(lotData.end_time) || ""}
            onChange={onInputChange}
          />
        </label>

        <label>
          ID організатора:
          <input
            type="text"
            name="creator_id"
            value={lotData.creator_id || ""}
            disabled
          />
        </label>

        <label>
          Статус:
          <select
            name="status"
            value={lotData.status || ""}
            onChange={onInputChange}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Створено:
          <input
            type="text"
            name="created-date"
            value={
              lotData.created_at
                ? new Date(lotData.created_at).toLocaleDateString(
                    "uk-UA",
                    dataFormat
                  )
                : ""
            }
            disabled
          />
        </label>

        <label>
          Оновлено:
          <input
            type="text"
            name="update"
            value={
              lotData.updated_at
                ? new Date(lotData.updated_at).toLocaleDateString(
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
        <button onClick={onSaveLot} style={{ marginRight: "20px" }}>
          Зберегти зміни
        </button>
        <button onClick={onDeleteLot}>Видалити лот</button>
      </div>
    </div>
  );
}

export default LotsControl;
