import React, { useState, useEffect, useRef } from "react";
import { SITE_TITLE } from "../../siteTittle";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import fundImage from "../../../pics/two-hands.png";

const ChoosePayment = () => {
  const { auctionId } = useParams();
  const { user } = useAuth();
  const [lotData, setLotData] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [funds, setFunds] = useState([
    {
      id: 1,
      title: "Фонд допомоги",
      description: "Фонд допомагає у важких обставинах",
      image: fundImage,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/lot/${auctionId}`);
        const data = await res.json();
        setLotData(data);
      } catch (error) {
        console.log("Помилка завантаження лоту:", error);
      }
    };

    fetchData();
  }, [auctionId]);

  useEffect(() => {
    if (lotData?.title) {
      document.title = `${SITE_TITLE} - Вибір оплати "${lotData.title}"`;
    } else {
      document.title = `${SITE_TITLE} - Такого лоту не існує!`;
    }
  }, [lotData?.title]);

  const handlePayment = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/lot/${auctionId}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({}),
        }
      );

      if (res.ok) {
        setIsPaid(true);
      } else {
        console.log("Помилка при оплаті");
      }
    } catch (error) {
      console.log("Помилка запиту:", error);
    }
  };

  return (
    <div className="all-page">
      <h2>Оберіть фонд для підтримки:</h2>
      <div className="some-funds">
        {funds.map((fund) => (
          <div className="one-fund" key={fund.id}>
            <img src={fund.image} alt={fund.title} className="fund-image" />
            <p className="fund-tittle">{fund.title}</p>
            <p className="fund-description">{fund.description}</p>
            <button onClick={() => setSelectedFund(fund)}>Обрати</button>
          </div>
        ))}
      </div>
      {selectedFund && lotData && !isPaid && (
        <div className="payment-info">
          <h3>Ви обрали фонд: {selectedFund.title}</h3>
          <p>
            Сума до оплати: <strong>{lotData.start_price} грн</strong>
          </p>
          <button onClick={handlePayment}>Оплатити</button>
        </div>
      )}
      {isPaid && (
        <div className="success-message">
          <h3>Дякуємо за оплату!</h3>
        </div>
      )}
    </div>
  );
};

export default ChoosePayment;
