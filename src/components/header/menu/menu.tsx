import { NavLink } from "react-router-dom";
import style from '../header.module.css';

export const Menu = () => {
  return (
    <ul className={style.menu}>
      <li><NavLink to="/">Главная</NavLink></li>
      <li><NavLink to="/blog">Блог</NavLink></li>
      <li><NavLink to="/contacts">Контакты</NavLink></li>
    </ul>
  );
};

