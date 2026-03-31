import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../../../store/slices/cartSlice";
import style from "./discount.module.css";
import { productsAPI } from "../../../../services/api";

interface DiscountProduct {
  id: string;
  categoryName: string;
  groupName: string;
  discount: boolean;
  gradeAndReviews: string;
  reviews: string;
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  weights: Record<string, number>;
}

export const DiscountSection = () => {
  const dispatch = useDispatch();
  const [discountProducts, setDiscountProducts] = useState<DiscountProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsDb: any = await productsAPI.getAll();
        const discount = Object.entries(productsDb)
          .filter(([key]) => ['tea', 'coffee', 'healthy', 'vending'].includes(key))
          .flatMap(([categoryName, category]: [string, any]) =>
            Object.entries(category?.products || {}).flatMap(([groupName, group]: [string, any]) =>
              (Array.isArray(group) ? group : [])
                .filter((p: any) => p.discount)
                .map((p: any) => ({ ...p, categoryName, groupName }))
            )
          );
        setDiscountProducts(discount);
      } catch (error) {
        console.warn("Products not available (backend offline)");
        setDiscountProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className={style.discount}>
        <div className="container">
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={style.discount}>
      <div className="container">
        <h2 className={style.discountTitle}>Товары со скидкой</h2>
        <p className={style.discountSubTitle}>
          Наша компания предлагает покупать товар со скидкой не только в дни
          распродаж, но и пользоваться скидками постоянно!
        </p>

        {discountProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Товары со скидкой временно недоступны. Запустите backend сервер для загрузки данных.</p>
          </div>
        ) : (
          <div className={style.productCardWrapper}>
            {discountProducts.map((product, index) => (
            <div
              className={style.productCard}
              key={`${product.categoryName}-${product.id}-${index}`}
            >
              <div className={style.productsStarAndSelect}>
                <div className={style.productsStar}>
                  {"★"
                    .repeat(5)
                    .split("")
                    .map((star, i) => (
                      <span key={i} className={style.star}>
                        {star}
                      </span>
                    ))}
                </div>
              </div>

              <p className={style.gradeAndReviews}>
                {product.gradeAndReviews}
                <span className={style.reviews}>{product.reviews}</span>
              </p>

              <div className={style.cardImage}>
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

              <p className={style.cardTitle}>{product.cardTitle}</p>
              <p className={style.cardDescription}>{product.cardDescription}</p>

              <div className={style.cardPriceAnDButtonWrapper}>
                <p className={style.cardPrice}>
                  {Object.values(product.weights)[0]} ₽
                </p>
                <button 
                  className={style.cardButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const firstWeight = Object.keys(product.weights)[0];
                    const price = product.weights[firstWeight];
                    
                    dispatch(
                      addToCart({
                        id: product.id,
                        title: product.cardTitle,
                        description: product.cardDescription,
                        image: product.cardImage,
                        price: price,
                        weight: firstWeight,
                        quantity: 1,
                        discount: product.discount || false,
                        category: product.categoryName || "",
                      })
                    );
                  }}
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

