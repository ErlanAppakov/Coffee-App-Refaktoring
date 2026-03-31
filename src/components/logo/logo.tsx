import style from "../header/header.module.css";
import LogoImages from "../../images/logo.svg";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <div className={style.logo}>
      <Link to="/">
        <img className={style.logoImages} src={LogoImages} alt="Logo" />
      </Link>
    </div>
  );
};

