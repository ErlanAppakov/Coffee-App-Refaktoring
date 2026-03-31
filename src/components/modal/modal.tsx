import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import style from "./modal.module.css";
import CloseModalBtnImage from "../../images/modal-close.svg";
import { closeModal, toggleModalType } from "../../store/slices/modalSlice";
import modalImage from "../../images/modalImage.png";
import LogoModalImage from "../../images/logo-modal.svg";
import { loginUser, registerUser } from "../../store/slices/userSlice";
import { RootState, AppDispatch } from "../../store/store";

export const Modal = () => {
  const { isOpen, type } = useSelector((state: RootState) => state.modal);
  const { error, loading, isAuth } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && isOpen) {
      dispatch(closeModal());
      navigate("/account");
    }
  }, [isAuth, isOpen, dispatch, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидация для регистрации
    if (type === "register") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Введите корректный email");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Пароль должен быть не менее 6 символов");
        return;
      }

      if (formData.name.trim().length < 2) {
        toast.error("Введите корректное имя");
        return;
      }
    }

    let result;
    if (type === "login") {
      result = await dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      result = await dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );
    }

    if (result.type.endsWith('/fulfilled')) {
      toast.success(type === "login" ? "Вы успешно вошли!" : "Регистрация прошла успешно!");
      dispatch(closeModal());
      navigate("/account");
    } else if (result.type.endsWith('/rejected')) {
      toast.error(result.payload || "Произошла ошибка");
    }
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <img src={modalImage} alt="" className={style.modalImage} />
        <div className={style.modalLeft}>
          <div className={style.modalSwitch}>
            {type === "register" ? (
              <>
                <p className={style.modalText}>Добро пожаловать!</p>
                <button
                  className={style.modalQuestionAccount}
                  onClick={() => dispatch(toggleModalType())}
                >
                  Уже есть аккаунт?
                </button>
              </>
            ) : (
              <>
                <p className={style.modalText}>Регистрация</p>
                <p className={style.loginSubTitle}>Получайте скидки первыми!</p>
                <button
                  className={style.loginBtn}
                  onClick={() => dispatch(toggleModalType())}
                >
                  Зарегистрироваться
                </button>
              </>
            )}
          </div>
        </div>

        <div className={style.modalRight}>
          <div className={style.modalLogoWrap}>
            <img src={LogoModalImage} alt="logo" />
          </div>

          <form className={style.modalForm} onSubmit={handleSubmit}>
            {type === "register" && (
              <input
                className={style.modalInput}
                type="text"
                name="name"
                placeholder="Имя и фамилия"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              className={style.modalInput}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {type === "register" && (
              <input
                className={style.modalInput}
                type="number"
                name="phone"
                placeholder="Телефон"
                value={formData.phone}
                onChange={handleChange}
              />
            )}

            <input
              className={style.modalInput}
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && <p className={style.error}>{error}</p>}

            <button 
              className={style.modalfromSubmit} 
              type="submit"
              disabled={loading}
            >
              {loading ? "Загрузка..." : type === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <button
            className={style.modalCloseBtn}
            onClick={() => dispatch(closeModal())}
          >
            <img src={CloseModalBtnImage} alt="Закрыть" />
          </button>
        </div>
      </div>
    </div>
  );
};
