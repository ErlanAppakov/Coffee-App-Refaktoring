import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { productsAPI } from "../../services/api";
import style from "./product-detail.module.css";
import { Product, CategoryData, ProductsData } from "../../types";
import { generateProducts } from "../../utils/generateProducts";

export const ProductDetail = () => {
  const { category, productId } = useParams<{ category: string; productId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
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

    fetchProducts();
  }, []);

  useEffect(() => {
    if (productsData && category && productId) {
      const currentCategory = productsData[category];
      
      let product =
        currentCategory &&
        Object.values(currentCategory.products)
          .flat()
          .find((p) => String(p.id) === String(productId));
      
      if (!product && currentCategory) {
        for (const buttonName of currentCategory.buttons || []) {
          const baseProducts = (currentCategory.products && currentCategory.products[buttonName] || []) as Product[];
          const generatedProducts = generateProducts(baseProducts, buttonName, category);
          const found = generatedProducts.find((p) => String(p.id) === String(productId));
          if (found) {
            product = found;
            break;
          }
        }
      }
      
      if (product && Object.keys(product.weights).length > 0) {
        setSelectedWeight(Object.keys(product.weights)[0]);
        setProduct(product);
      }
    }
  }, [productsData, category, productId]);

  if (loading || !productsData || !category || !productId) {
    return <div>Загрузка...</div>;
  }

  const currentCategory = productsData[category];
  const price =
    product && selectedWeight ? product.weights[selectedWeight] * quantity : 0;

  if (!currentCategory) return <p>Категория не найдена</p>;
  if (!product) return <p>Товар не найден</p>;

  return (
    <section className={style.product}>
      <div className="container">
        <div className={style.wrapper}>
          <div className={style.imageBlock}>
            <img 
              src={product.cardImage.startsWith('/') ? product.cardImage : `/${product.cardImage}`} 
              alt={product.cardTitle}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('discount-1.png')) {
                  target.src = '/src/images/discount-1.png';
                }
              }}
            />
          </div>

          <div className={style.infoBlock}>
            <h1 className={style.title}>{product.cardTitle}</h1>

            <div className={style.rating}>
              <span className={style.stars}>★★★★☆</span>
              <span className={style.grade}>{product.gradeAndReviews}</span>
              <span className={style.reviews}>({product.reviews})</span>
            </div>

            <p className={style.description}>{product.cardDescription}</p>

            <div className={style.weights}>
              {Object.entries(product.weights).map(([grams]) => (
                <label
                  key={grams}
                  className={`${style.weightOption} ${
                    selectedWeight === grams ? style.active : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="weight"
                    value={grams}
                    checked={selectedWeight === grams}
                    onChange={() => setSelectedWeight(grams)}
                  />
                  {grams} г.
                </label>
              ))}
            </div>

            <div className={style.quantity}>
              <div className={style.quantityBtnWrap}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={style.counterBtn}
                >
                  −
                </button>
                <span className={style.quantityNum}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className={style.counterBtn}
                >
                  +
                </button>
              </div>
              <button
                className={style.buyBtn}
                onClick={() => {
                  if (!product || !selectedWeight) return;
                  dispatch(
                    addToCart({
                      id: product.id,
                      title: product.cardTitle,
                      description: product.cardDescription,
                      image: product.cardImage,
                      price: price,
                      weight: selectedWeight,
                      quantity: quantity,
                      discount: product.discount || false,
                      category: category || "",
                    })
                  );
                  navigate("/cart");
                }}
              >
                Купить за {price} ₽
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
