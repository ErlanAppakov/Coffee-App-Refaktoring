import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { removeFromCart, updateQuantity, clearCart, CartItem } from "../../store/slices/cartSlice";
import { updateUser } from "../../store/slices/userSlice";
import { openModal } from "../../store/slices/modalSlice";
import { usersAPI } from "../../services/api";
import style from "./cart.module.css";
import MasterCardImage from "../../images/masterCard.png";
import VisaImage from "../../images/visa.png";

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryOptions = [
    { id: "sdek", name: "СДЭК - до двери", price: 390 },
    { id: "post", name: "Почта России", price: 300 },
    { id: "dpd", name: "DPD - курьер, 3 дн", price: 427 },
  ];

  const calculateItemTotal = (item: CartItem): number => {
    const subtotal = item.price * item.quantity;
    const discount = item.discount ? subtotal * 0.1 : 0;
    return subtotal - discount;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateDiscount = (): number => {
    return cartItems.reduce((sum, item) => {
      if (item.discount) {
        return sum + item.price * item.quantity * 0.1;
      }
      return sum;
    }, 0);
  };

  const getDeliveryPrice = (): number => {
    const delivery = deliveryOptions.find((opt) => opt.id === selectedDelivery);
    return delivery ? delivery.price : 0;
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const delivery = getDeliveryPrice();
    return subtotal - discount + delivery;
  };

  const handleRemoveItem = (id: string | number, weight: string) => {
    dispatch(removeFromCart({ id, weight }));
  };

  const handleUpdateQuantity = (id: string | number, weight: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, weight, quantity: newQuantity }));
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.warn("Корзина пуста");
      return;
    }

    if (!selectedDelivery) {
      toast.warn("Пожалуйста, выберите способ доставки");
      return;
    }

    // Проверяем авторизацию и восстанавливаем пользователя из localStorage, если нужно
    let currentUser = user;
    if (!currentUser) {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            currentUser = parsedUser;
            // Обновляем Redux store
            dispatch(updateUser(parsedUser));
          }
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    }

    if (!currentUser || !currentUser.id) {
      toast.info("Пожалуйста, войдите в систему для оформления заказа");
      // Открываем модалку входа
      dispatch(openModal("register"));
      return;
    }

    setIsProcessing(true);
    try {

      const deliveryPrice = getDeliveryPrice();
      const orderItems = cartItems.map(item => ({
        title: item.title,
        weight: item.weight,
        price: item.price * item.quantity, // Общая цена за все единицы товара
        quantity: item.quantity,
        discount: item.discount,
      }));

      await usersAPI.createOrder(currentUser.id, {
        items: orderItems,
        delivery: deliveryPrice,
      });

      // Обновляем пользователя
      const updatedUser = await usersAPI.getUser(currentUser.id);
      dispatch(updateUser(updatedUser));

      // Очищаем корзину
      dispatch(clearCart());

      toast.success("Заказ успешно создан!");
      navigate("/account");
    } catch (error: any) {
      console.error("Ошибка при создании заказа:", error);
      toast.error(error.message || "Ошибка при создании заказа");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Вы уверены, что хотите удалить все товары из корзины?")) {
      dispatch(clearCart());
    }
  };

  const getItemCount = (): number => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getItemWord = (count: number): string => {
    if (count % 10 === 1 && count % 100 !== 11) return "товар";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "товара";
    return "товаров";
  };

  if (cartItems.length === 0) {
    return (
      <section className={style.cart}>
        <div className="container">
          <div className={style.cartInner}>
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Корзина пуста</h2>
              <p style={{ color: "#747474" }}>Добавьте товары в корзину, чтобы продолжить</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={style.cart}>
        <div className="container">
          <div className={style.cartInner}>
            <div className={style.cartInfoPanel}>
              <h2 className={style.cartQuantityProduct}>
                {getItemCount()} {getItemWord(getItemCount())} в корзине
              </h2>
              <button className={style.deleteAllBtn} onClick={handleClearCart}>
                Удалить все
              </button>
            </div>

            <div className={`${style.cartRow} ${style.cartHeader}`}>
              <span>Удалить товар</span>
              <span>Наименование товара</span>
              <span>Цена</span>
              <span>Количество</span>
              <span>Скидка (10%)</span>
              <span>Итого</span>
            </div>

            <div className={style.cartList}>
              {cartItems.map((item) => {
                const itemTotal = calculateItemTotal(item);
                const itemDiscount = item.discount ? item.price * item.quantity * 0.1 : 0;

                return (
                  <div
                    className={`${style.cartRow} ${style.cartColor}`}
                    key={`${item.id}-${item.weight}`}
                  >
                    <button
                      className={style.deleteProductBtn}
                      onClick={() => handleRemoveItem(item.id, item.weight)}
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.00082 2.00024L17.0005 16.9999"
                          stroke="#F9B300"
                          strokeWidth="2.12553"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17.0004 2L2.00071 16.9997"
                          stroke="#F9B300"
                          strokeWidth="2.12553"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    <div className={style.productInfo}>
                      <div className={style.productImage}>
                        <img
                          src={item.image.startsWith("/") ? item.image : `/${item.image}`}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("discount-1.png")) {
                              target.src = "/src/images/discount-1.png";
                            }
                          }}
                        />
                      </div>
                      <div>
                        <p className={style.productName}>{item.title}</p>
                        <p className={style.productDesc}>{item.description}</p>
                        <p className={style.productWeight}>{item.weight} г.</p>
                      </div>
                    </div>

                    <p className={style.productPrice}>{item.price} ₽</p>

                    <div className={style.counter}>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.weight, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.weight, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className={style.productSale}>
                      {itemDiscount > 0 ? `${Math.round(itemDiscount)} ₽` : "—"}
                    </p>

                    <p className={style.total}>{Math.round(itemTotal)} ₽</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className={style.delivery}>
        <div className="container">
          <div className={style.deliveryInner}>
            <h2 className={style.deliveryTitle}>Доставка</h2>
            <form className={style.deliveryForm}>
              <input type="text" placeholder="Имя" />
              <input type="text" placeholder="Страна" />
              <input type="text" placeholder="Фамилия" />
              <input type="text" placeholder="Город" />
              <input type="number" placeholder="Телефон" />
              <input type="text" placeholder="Улица, дом" />
              <input type="email" placeholder="Email" />
              <input type="number" placeholder="Почтовый индекс" />
            </form>
          </div>
        </div>
      </section>
      <section className={style.payment}>
        <div className="container">
          <div className={style.paymentInner}>
            <div className={style.paymentInfoPanel}>
              <h2 className={style.paymentTitle}>
                Итог: <span>{Math.round(calculateTotal())} ₽</span>
              </h2>
              <div className={style.paymentImgBlock}>
                <img src={MasterCardImage} alt="MasterCard" loading="lazy" />
                <img src={VisaImage} alt="Visa" loading="lazy" />
              </div>
            </div>
            <p className={style.subtotal}>Подытог: {Math.round(calculateSubtotal())} ₽</p>
            <p className={style.sale}>
              Скидка: {Math.round(calculateDiscount())} ₽{" "}
              {calculateDiscount() > 0 ? "(10%)" : ""}
            </p>
            <div className={style.deliveryChoice}>
              <p className={style.deliverySubtitle}>Доставка:</p>
              <form className={style.choiceDeliveryForm}>
                {deliveryOptions.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={selectedDelivery === option.id}
                      onChange={(e) => setSelectedDelivery(e.target.value)}
                    />
                    {option.name} {option.price} ₽
                  </label>
                ))}
              </form>
            </div>
            <button 
              className={style.payBtn} 
              onClick={handleCreateOrder}
              disabled={isProcessing || cartItems.length === 0 || !selectedDelivery}
            >
              {isProcessing ? "Обработка..." : "Оплатить заказ"}
            </button>
            <p className={style.confidentText}>
              Ваши персональные данные будут использоваться для управления
              доступом к вашей учетной записи и для других целей, описанных в
              нашем документе политика конфиденциальности.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
