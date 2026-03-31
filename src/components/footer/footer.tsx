import { Menu } from "../header/menu/menu";
import { Logo } from "../logo/logo";
import style from "./footer.module.css";
import FootertopImages from "../../images/footer-top-image.png";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className={style.footerTop}>
          <div className={style.leftBlock}>
            <h2 className={style.footerTitle}>
              Подписка на новости и рассылку
            </h2>
            <p className={style.footerSubtitle}>
              Подпишитесь на нашу рассылку прямо сейчас и будьте в курсе новых
              поставок, скидок и эксклюзивных предложений.
            </p>
            <form className={style.footerForm}>
              <input
                type="email"
                placeholder="Ваш email"
                className={style.footerInput}
              />
              <button className={style.footerBtnSubmit} type="submit">
                Подписаться
              </button>
            </form>
            <p className={style.formText}>
              Нажимая на кнопку "Подписаться", вы принимаете правила{" "}
              <a href="/" className={style.userAgreement}>
                пользовательского соглашения
              </a>
            </p>
          </div>
          <img src={FootertopImages} alt={FootertopImages} />
        </div>
        <div className={style.footerBottom}>
          <Logo />
          <Menu />
        </div>
      </div>
    </footer>
  );
};

