import { useState } from "react";
import style from "./contacts.module.css";

export const ContactsPage = () => {
  const [active, setActive] = useState(0);
  const ativeBtnFunc = (index: number) => {
    setActive(index);
  };
  return (
    <section className={style.contacts}>
      <div className="container">
        <div className={style.contactsSwitchWrap}>
          <button
            className={`${style.switchBtn} ${active === 0 && style.activeBtn}`}
            onClick={() => {
              ativeBtnFunc(0);
            }}
          >
            Контакты
          </button>
          <button
            className={`${style.switchBtn} ${active === 1 && style.activeBtn}`}
            onClick={() => {
              ativeBtnFunc(1);
            }}
          >
            Наши магазины
          </button>
        </div>
        <div className={style.contactMapWrap}>
          <div className={style.contactBlockWrap}>
            {active === 0 ? (
              <div className={style.contactBlock}>
                <h3 className={style.contactUsTitle}>Связаться с нами:</h3>
                <a href="#" className={style.contactPhone}>
                  +7 (401) 237 53 43
                </a>
                <a href="#" className={style.contactMail}>
                  Import@kldrefine.com
                </a>
                <h3 className={style.contactUsTitle}>Юридический адрес:</h3>
                <p className={style.address}>
                  Российская, Федерация, 238310, Калининградская область,
                  Гурьевский район, поселок Васильково, улица Шатурская, дом 4А
                </p>
                <h3 className={style.contactUsTitle}>Юридический адрес:</h3>
                <p className={style.boxAddress}>
                  Московская область, Балашиха, Западная промзона, Шоссе
                  энтузиастов 1
                </p>
              </div>
            ) : (
              <div className={style.ourStoresWrap}>
                <h3
                  className={`${style.contactUsTitle} ${style.ourStoreTitle}`}
                >
                  Наши магазины г. Санкт-Петербург
                </h3>
                <p className={style.ourStoreAddress}>Гороховая, 53</p>
                <p className={style.ourStoreAddress}>Московский, 53</p>
                <h3
                  className={`${style.contactUsTitle} ${style.ourStoreTitle} ${style.ourStoreTitlePt}`}
                >
                  Наши магазины Калининградская обл.
                </h3>
                <p className={style.ourStoreAddress}>Советск, Гончарова 2а</p>
                <p className={style.ourStoreAddress}>
                  Черняховск, Пионерская 1
                </p>
                <p className={style.ourStoreAddress}>Ульяны-Громовой 15</p>
                <p className={style.ourStoreAddress}>Советский проспект 6а</p>
                <p className={style.ourStoreAddress}>Гурьевск, Каштановая 1г</p>
                <p className={style.ourStoreAddress}>Черняховского 15</p>
                <p className={style.ourStoreAddress}>Панина 2а</p>
                <p className={style.ourStoreAddress}>Ленинский 8Б</p>
                <p className={style.ourStoreAddress}>Аксакова 133</p>
                <p className={style.ourStoreAddress}>Липовая Аллея 2</p>
              </div>
            )}
          </div>
          <div className={style.mapContainer}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Aacaf3c92766f4a6a96d8c62f8f49f2ff8f73f7b11863a1a9c8af9df6f0a98c8a&amp;source=constructor"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

