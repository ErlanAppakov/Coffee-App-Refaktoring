import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, updateUser } from "../../store/slices/userSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { usersAPI } from "../../services/api";
import style from "./account.module.css";
import { RootState, AppDispatch } from "../../store/store";
import defaultAvatar from "../../images/default-user-profile.svg";

interface OrderItem {
  title: string;
  weight: string;
  price: number;
}

export const AccountPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  if (!user) return null;

  const calculateOrdersTotal = (): number => {
    if (!user.orders || user.orders.length === 0) return 0;
    return user.orders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
  };

  const calculateNextDiscountThreshold = (): number => {
    const currentTotal = calculateOrdersTotal();
    const nextDiscount = user.discount === 10 ? 15 : user.discount === 15 ? 20 : 0;
    if (nextDiscount === 0) return 0;
    
    const thresholds: Record<number, number> = {
      15: 10000,
      20: 20000,
    };
    const threshold = thresholds[nextDiscount] || 0;
    return Math.max(0, threshold - currentTotal);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 7 * 1024 * 1024) {
        setPasswordError("Размер изображения не должен превышать 7MB для корректного сохранения");
        return;
      }

      if (!file.type.startsWith('image/')) {
        setPasswordError("Выберите файл изображения");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result.length > 10 * 1024 * 1024) {
          setPasswordError("Изображение слишком большое после конвертации. Пожалуйста, используйте изображение размером до 5-7MB");
          return;
        }
        setAvatarPreview(result);
      };
      reader.onerror = () => {
        setPasswordError("Ошибка при чтении файла");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    try {
      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setPasswordError("Новые пароли не совпадают");
          return;
        }

        if (passwordData.newPassword.length < 6) {
          setPasswordError("Пароль должен быть не менее 6 символов");
          return;
        }

        await usersAPI.changePassword(user.id, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        setPasswordSuccess("Пароль успешно изменен!");
      }

      if (avatarPreview && avatarPreview !== user.avatar && avatarFile) {
        try {
          if (!avatarPreview.startsWith('data:image/')) {
            setPasswordError("Неверный формат изображения");
            return;
          }

          await usersAPI.updateUser(user.id, {
            avatar: avatarPreview,
          });
          setPasswordSuccess((prev) => prev ? prev + " Аватар обновлен!" : "Аватар обновлен!");
        } catch (avatarError: any) {
          console.error("Ошибка при обновлении аватара:", avatarError);
          setPasswordError(avatarError.message || "Ошибка при сохранении аватара. Попробуйте изображение меньшего размера.");
          return;
        }
      }

      const updatedUser = await usersAPI.getUser(user.id);
      dispatch(updateUser(updatedUser));

      setTimeout(() => {
        setShowEditModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setAvatarFile(null);
        setPasswordSuccess("");
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || "Ошибка при сохранении");
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className={style.account}>
      <div className="container">
        <div className={style.profileWrapper}>
          <div className={style.profileInfo}>
            <div className={style.avatarWrapper}>
              <img
                src={avatarPreview || user.avatar || defaultAvatar}
                alt="Profile"
                className={style.avatar}
                loading="lazy"
              />
            </div>
            <div className={style.userDetails}>
              <h2 className={style.userName}>
                {user.name}, здравствуйте!
              </h2>
              <p className={style.userEmail}>{user.email}</p>
              <p className={style.userPhone}>
                {user.phone || "+7 (909) 909 99 99"}
              </p>
              <p className={style.userPassword}>Пароль: **********</p>
              <button
                className={style.editBtn}
                onClick={() => setShowEditModal(true)}
              >
                Изменить
              </button>
              {user.role === "admin" && (
                <Link to="/admin" className={style.adminBtn}>
                  Админ-панель
                </Link>
              )}
              <button
                className={style.logoutBtn}
                onClick={() => {
                  dispatch(clearCart());
                  dispatch(logout());
                  navigate('/');
                }}
              >
                Выйти
              </button>
            </div>
          </div>

          <div className={style.discountCard}>
            <div className={style.discountHeader}>
              <h3 className={style.discountTitle}>Ваша скидка: {user.discount}%</h3>
              <div className={style.discountHintIcon}>?</div>
            </div>
            <p className={style.discountText}>
              Сумма заказов: {calculateOrdersTotal()} Р*
            </p>
            {calculateNextDiscountThreshold() > 0 && (
              <p className={style.discountProgress}>
                *До скидки {user.discount === 10 ? 15 : user.discount === 15 ? 20 : 0}% не хватает покупок на сумму: {calculateNextDiscountThreshold()} Р
              </p>
            )}
          </div>
        </div>

        <div className={style.ordersSection}>
          <div className={style.ordersHeader}>
            <h2 className={style.ordersTitle}>Мои заказы</h2>
            {user.orders && user.orders.length > 0 && (
              <button
                className={style.deleteOrdersBtn}
                onClick={async () => {
                  if (window.confirm("Вы уверены, что хотите удалить всю историю заказов?")) {
                    try {
                      await usersAPI.clearOrders(user.id);
                      const updatedUser = await usersAPI.getUser(user.id);
                      dispatch(updateUser(updatedUser));
                      toast.success("История заказов очищена");
                    } catch (error: any) {
                      toast.error(error.message || "Ошибка при удалении заказов");
                    }
                  }
                }}
              >
                Удалить историю
              </button>
            )}
          </div>
          
          {user.orders && user.orders.length > 0 ? (
            <div className={style.ordersList}>
              {user.orders.map((order) => (
                <div key={order.id} className={style.orderCard}>
                  <div className={style.orderHeader}>
                    <span className={style.orderDate}>
                      {order.date} - {order.status === 'paid' || order.status === 'оплачено' ? 'оплачено' : 'не оплачено'}
                    </span>
                    {order.deliveryDate && (
                      <span className={style.deliveryDate}>
                        Дата доставки: {formatDate(order.deliveryDate)}
                      </span>
                    )}
                  </div>

                  <div className={style.orderTable}>
                    <div className={style.tableHeader}>
                      <div>Товаров:</div>
                      <div>Сумма заказа:</div>
                      <div>Скидка ({user.discount}%):</div>
                      <div>Сумма заказа:</div>
                    </div>
                    {order.items.map((item: OrderItem, idx: number) => {
                      const itemSubtotal = item.price;
                      const itemDiscount = itemSubtotal * (user.discount / 100);
                      const itemTotal = itemSubtotal - itemDiscount;
                      
                      const quantityMatch = item.title.match(/^(\d+)\s*x\s*/);
                      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
                      const titleWithoutQuantity = item.title.replace(/^\d+\s*x\s*/, '');
                      
                      return (
                        <div key={idx} className={style.tableRow}>
                          <div>{quantity} x {titleWithoutQuantity}, {item.weight}</div>
                          <div>{Math.round(itemSubtotal)} Р</div>
                          <div>{Math.round(itemDiscount)} Р</div>
                          <div>{Math.round(itemTotal)} Р</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={style.orderFooter}>
                    <p className={style.orderTotal}>
                      Сумма заказа: {order.total ? Math.round(order.total) : (order.subtotal ? Math.round(order.subtotal - (order.discount || 0) + (order.delivery || 0)) : 0)} Р
                    </p>
                    {order.delivery && order.delivery > 0 && (
                      <p className={style.orderDelivery}>
                        Доставка: {Math.round(order.delivery)} Р
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={style.noOrders}>У вас пока нет заказов</p>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className={style.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.modalClose}
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <h3 className={style.modalTitle}>Редактирование профиля</h3>
            
            <form onSubmit={handleSaveProfile} className={style.modalForm}>
              <div className={style.formGroup}>
                <label>Аватар профиля:</label>
                <div className={style.avatarUpload}>
                  <img
                    src={avatarPreview || user.avatar || defaultAvatar}
                    alt="Preview"
                    className={style.avatarPreview}
                    loading="lazy"
                  />
                  <label className={style.fileInputLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className={style.fileInput}
                    />
                    Выбрать фото
                  </label>
                  {avatarPreview && avatarPreview !== user.avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(user.avatar || "");
                        setAvatarFile(null);
                      }}
                      className={style.removeAvatarBtn}
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>

              <div className={style.formGroup}>
                <label>Текущий пароль:</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Оставьте пустым, если не меняете"
                />
              </div>

              <div className={style.formGroup}>
                <label>Новый пароль:</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Оставьте пустым, если не меняете"
                  minLength={6}
                />
              </div>

              <div className={style.formGroup}>
                <label>Подтвердите новый пароль:</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Оставьте пустым, если не меняете"
                  minLength={6}
                />
              </div>

              {passwordError && (
                <div className={style.errorMessage}>{passwordError}</div>
              )}

              {passwordSuccess && (
                <div className={style.successMessage}>{passwordSuccess}</div>
              )}

              <div className={style.modalButtons}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={style.cancelBtn}
                >
                  Отмена
                </button>
                <button type="submit" className={style.saveBtn}>
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
