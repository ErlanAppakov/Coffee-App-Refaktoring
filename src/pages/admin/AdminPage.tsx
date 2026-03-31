import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { productsAPI, usersAPI } from "../../services/api";
import { ProductTable } from "./components/ProductTable";
import { ProductForm } from "./components/ProductForm";
import style from "./admin.module.css";
import { Product, ProductsData } from "../../types";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  discount: number;
  ordersCount: number;
}

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("tea");
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [formData, setFormData] = useState({
    cardTitle: "",
    cardDescription: "",
    cardImage: "src/images/discount-1.png",
    gradeAndReviews: "4.0",
    reviews: "0 (отзывов)",
    discount: false,
    weights: { "100": 0, "200": 0, "500": 0, "1000": 0 } as Record<string, number>,
  });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (productsData && selectedCategory && productsData[selectedCategory]?.buttons?.length > 0) {
      setSelectedButton(productsData[selectedCategory].buttons[0]);
    }
  }, [productsData, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProductsData(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      cardTitle: "",
      cardDescription: "",
      cardImage: "src/images/discount-1.png",
      gradeAndReviews: "4.0",
      reviews: "0 (отзывов)",
      discount: false,
      weights: { "100": 0, "200": 0, "500": 0, "1000": 0 },
    });
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      cardTitle: product.cardTitle,
      cardDescription: product.cardDescription,
      cardImage: product.cardImage,
      gradeAndReviews: product.gradeAndReviews,
      reviews: product.reviews,
      discount: product.discount || false,
      weights: { ...product.weights },
    });
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string | number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

    if (!productsData || !selectedCategory || !selectedButton) return;

    const category = productsData[selectedCategory];
    const products = category.products[selectedButton] || [];
    const updatedProducts = products.filter((p) => p.id !== productId);

    const updatedData = {
      ...productsData,
      [selectedCategory]: {
        ...category,
        products: {
          ...category.products,
          [selectedButton]: updatedProducts,
        },
      },
    };

    try {
      await productsAPI.updateAll(updatedData);
      await fetchProducts();
      toast.success("Товар успешно удален!");
    } catch (error: any) {
      toast.error("Ошибка при удалении товара: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productsData || !selectedCategory || !selectedButton) return;

    const category = productsData[selectedCategory];
    const products = category.products[selectedButton] || [];

    const newProduct: Product = {
      id: editingProduct?.id || Date.now(),
      cardTitle: formData.cardTitle,
      cardDescription: formData.cardDescription,
      cardImage: formData.cardImage,
      gradeAndReviews: formData.gradeAndReviews,
      reviews: formData.reviews,
      discount: formData.discount,
      weights: formData.weights,
    };

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = products.map((p) => (p.id === editingProduct.id ? newProduct : p));
    } else {
      updatedProducts = [...products, newProduct];
    }

    const updatedData = {
      ...productsData,
      [selectedCategory]: {
        ...category,
        products: {
          ...category.products,
          [selectedButton]: updatedProducts,
        },
      },
    };

    try {
      await productsAPI.updateAll(updatedData);
      await fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      toast.success(editingProduct ? "Товар успешно обновлен!" : "Товар успешно добавлен!");
    } catch (error: any) {
      toast.error("Ошибка при сохранении товара: " + error.message);
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!newPassword || newPassword.length < 4) {
      toast.warn("Пароль должен содержать минимум 4 символа");
      return;
    }

    try {
      await usersAPI.resetUserPassword(userId, newPassword);
      toast.success("Пароль успешно сброшен!");
      setShowPasswordModal(false);
      setNewPassword("");
      setEditingUser(null);
    } catch (error: any) {
      toast.error("Ошибка при сбросе пароля: " + error.message);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!window.confirm(`Изменить роль пользователя на "${newRole}"?`)) return;

    try {
      await usersAPI.updateUserRole(userId, newRole);
      toast.success("Роль успешно изменена!");
      await fetchUsers();
    } catch (error: any) {
      toast.error("Ошибка при изменении роли: " + error.message);
    }
  };

  const currentProducts = productsData?.[selectedCategory]?.products?.[selectedButton] || [];

  if (loading) {
    return <div className={style.loading}>Загрузка...</div>;
  }

  return (
    <div className={style.adminPage}>
      <div className="container">
        <h1 className={style.title}>Панель администратора</h1>

        <div className={style.tabs}>
          <button
            className={`${style.tab} ${activeTab === "products" ? style.activeTab : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Товары
          </button>
          <button
            className={`${style.tab} ${activeTab === "users" ? style.activeTab : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Пользователи
          </button>
        </div>

        {activeTab === "products" && (
          <>
            <div className={style.controls}>
              <div className={style.selectGroup}>
                <label>Категория:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={style.select}
                >
                  <option value="tea">Чай и кофейные напитки</option>
                  <option value="coffee">Свежеобжаренный кофе</option>
                  <option value="healthy">Здоровое питание</option>
                  <option value="vending">Продукция для вендинга</option>
                </select>
              </div>

              <div className={style.selectGroup}>
                <label>Подкатегория:</label>
                <select
                  value={selectedButton || ""}
                  onChange={(e) => setSelectedButton(e.target.value)}
                  className={style.select}
                >
                  {productsData?.[selectedCategory]?.buttons.map((btn) => (
                    <option key={btn} value={btn}>
                      {btn}
                    </option>
                  ))}
                </select>
              </div>

              <button className={style.addBtn} onClick={handleAddProduct}>
                Добавить товар
              </button>
            </div>

            <ProductTable
              products={currentProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />

            {showForm && (
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
                isEditing={!!editingProduct}
              />
            )}
          </>
        )}

        {activeTab === "users" && (
          <div className={style.usersSection}>
            <h2 className={style.sectionTitle}>Управление пользователями</h2>
            <div className={style.tableWrapper}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Скидка</th>
                    <th>Заказов</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className={style.idCell}>{user.id.substring(0, 8)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className={style.roleSelect}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>{user.discount}%</td>
                      <td>{user.ordersCount}</td>
                      <td>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowPasswordModal(true);
                            setNewPassword("");
                          }}
                          className={style.resetPasswordButton}
                        >
                          Сбросить пароль
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showPasswordModal && editingUser && (
          <div className={style.modalOverlay}>
            <div className={style.modalContent}>
              <h2>Сброс пароля для {editingUser.email}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword(editingUser.id);
                }}
                className={style.form}
              >
                <div className={style.formGroup}>
                  <label>Новый пароль:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={4}
                    placeholder="Минимум 4 символа"
                  />
                </div>
                <div className={style.formActions}>
                  <button type="submit" className={style.saveBtn}>
                    Сбросить пароль
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setEditingUser(null);
                      setNewPassword("");
                    }}
                    className={style.cancelBtn}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
