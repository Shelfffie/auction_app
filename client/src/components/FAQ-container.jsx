import React, { useState } from "react";
import "../../styles/styles.css";

function FAQ() {
  const faqs = [
    {
      question: "Як створити лот?",
      answer:
        ".answer  max-height: 0overflow: hidden;background: #6d5640; color: #fff2dd;transition: max-height 0.4s ease, padding 0.4s ease;padding: 0 20px;                  /* горизонтальні відступи */border-radius: 0 0 5px 5px;",
    },
    {
      question: "Що можна виставляти на аукціон?",
      answer: "Все шо ок, люди не продаються",
    },
    { question: "Куди йдуть кошти?", answer: "мені в карман" },
    {
      question: "Як я дізнаюся, що виграв ставку?",
      answer: "ніяк, ти зплатиш а я заберу собі",
    },
    {
      question: "Що робити після виграша лота?",
      answer: "плакать бо тебе на сайті блокнуть",
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
