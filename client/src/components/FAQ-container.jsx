import React, { useState } from "react";
import "../../styles/styles.css";

function FAQ() {
  const faqs = [
    {
      question: "Як створити лот?",
      answer:
        " Для початку потрібно відправити заявку на підтвердження. Там повинні міститися фотоо паспорта, особисте фото з цим паспортом та всі необхідні дані. Після підтвердження можна буде виставити лот.",
    },
    {
      question: "Що можна виставляти на аукціон?",
      answer: "Все що завгодно, починаючти від звичайного малюнку до техніки.",
    },
    {
      question: "Куди йдуть кошти?",
      answer:
        "При оплаті обирається бажаний фонд, куди будуть спрямовані кошти.",
    },
    {
      question: "Як я дізнаюся, що виграв ставку?",
      answer: "Потом",
    },
    {
      question: "Що робити після виграша лота?",
      answer:
        "Після закінчення аукціону та виграшу лота можна перейти в чат з аукціоном та безпосередньо в ньому оплатити необхідну суму. Після оплати ведеться діалог з організатором.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const clicked = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="Faq">
      <img
        src="./../../pics/questionsign.png"
        alt=""
        className="questions-png"
      />
      <div className="questions-sector">
        <p className="about-title">Поширені запитання </p>
        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`question ${openIndex === index ? "open" : ""}`}
              onClick={() => clicked(index)}
            >
              <div className="summaryquestion">{faq.question}</div>
              {openIndex === index && (
                <div className="details-content">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
