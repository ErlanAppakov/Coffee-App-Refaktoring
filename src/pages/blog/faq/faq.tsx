import { useState, useEffect } from "react";
import style from "./faq.module.css";
import benefitsBackImage from "../../../images/benefits-back.png";
import faqCoffeeImg from "../../../images/faq-coffee.png";
import { faqAPI } from "../../../services/api";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const Faq = () => {
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const data = await faqAPI.getAll();
        setFaqData(data);
        if (data.length > 2) {
          setOpenId(data[2].id);
        }
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQ();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section
        className={style.faq}
        style={{ backgroundImage: `url(${benefitsBackImage})` }}
      >
        <div className="container">
          <div>Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={style.faq}
      style={{ backgroundImage: `url(${benefitsBackImage})` }}
    >
      <div className="container">
        <div className={style.faqInner}>
          <h2 className={style.faqTitle}>Частые вопросы:</h2>
          <div className={style.faqFlex}>
            <div
              className={style.faqBackImage}
              style={{ backgroundImage: `url(${faqCoffeeImg})` }}
            ></div>
            <div className={style.faqContentBlock}>
              {faqData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>Вопросы временно недоступны. Запустите backend сервер для загрузки данных.</p>
                </div>
              ) : (
                faqData.map((item) => (
                <div
                  key={item.id}
                  className={`${style.faqItem} ${
                    openId === item.id ? style.active : ""
                  }`}
                >
                  <button
                    className={style.faqQuestion}
                    onClick={() => toggleAccordion(item.id)}
                  >
                    {item.question}
                    <span className={style.icon}>
                      {openId === item.id ? "−" : "+"}
                    </span>
                  </button>

                  {openId === item.id && (
                    <div className={style.faqAnswer}>
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

