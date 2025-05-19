import React, { useState, useEffect, useRef } from "react";
import { SITE_TITLE } from "../../siteTittle";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import fundImage from "../../../pics/two-hands.png";
import "../../../styles/payment-choose.css";

const ChoosePayment = () => {
  const navigate = useNavigate();
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
    {
      id: 2,
      title: "Фонд допомоги тваринам",
      description: "Фонд допомагає тваринам, підтримуває притулки",
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
        setTimeout(() => {
          navigate(`/lot/${auctionId}/messages`);
        }, 2000);
      } else {
        console.log("Помилка при оплаті");
      }
    } catch (error) {
      console.log("Помилка запиту:", error);
    }
  };

  return (
    <div className="all-page">
      <h2 className="choose-fund-title">Оберіть фонд для підтримки:</h2>
      <div className="some-funds">
        {funds.map((fund) => (
          <div key={fund.id}>
            <div className="one-fund">
              <img src={fund.image} alt={fund.title} className="fund-image" />
              <div className="title-description-fund">
                <h2 className="fund-title">{fund.title}</h2>
                <p className="fund-description">{fund.description}</p>
              </div>
              <button
                onClick={() => setSelectedFund(fund)}
                className="fund-button"
              >
                Обрати
              </button>
            </div>

            {selectedFund?.id === fund.id && (
              <>
                {isPaid ? (
                  <div className="payment-info">
                    <h2>Дякуємо за оплату!</h2>
                  </div>
                ) : (
                  <div className="payment-info">
                    <div>
                      <h3>Ви обрали фонд: {fund.title}</h3>
                      <p>
                        Сума до оплати:{" "}
                        <strong>{lotData?.start_price || 0} грн</strong>
                      </p>
                    </div>
                    <button onClick={handlePayment} className="payment-button">
                      Оплатити
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePayment;
