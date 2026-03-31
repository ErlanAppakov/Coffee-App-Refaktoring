import { Logo } from "../logo/logo";
import { Modal } from "../modal/modal";
import { ControlPanel } from "./control-panel/control-panel";
import style from "./header.module.css";
import { Menu } from "./menu/menu";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const Header = () => {
  const isSearchOpen = useSelector((state: RootState) => state.search?.isOpen || false);

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.headerInner}>
          <Logo />
          {!isSearchOpen && <Menu />}
          <ControlPanel />
          <Modal />
        </div>
      </div>
    </header>
  );
};

