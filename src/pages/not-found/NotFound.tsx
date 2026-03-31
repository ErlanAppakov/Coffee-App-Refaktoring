import { Link } from "react-router-dom";
import style from "./not-found.module.css";
import notFoundImage from "../../images/not-found.png";

export const NotFound = () => {
  return (
    <div className={style.notFound}>
      <div className={style.container}>
        <div className={style.content}>
          <h1 className={style.title}>404</h1>
          <h2 className={style.subtitle}>Страница не найдена</h2>
          <p className={style.description}>
            Извините, страница, которую вы ищете, не существует. Она могла быть удалена или перемещена.
          </p>
          <Link to="/" className={style.homeBtn}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
};
