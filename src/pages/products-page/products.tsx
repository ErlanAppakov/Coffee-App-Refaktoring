import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Skeleton } from "../../components/ui";
import { addToCart } from "../../store/slices/cartSlice";
import style from "./products.module.css";
import { productsAPI } from "../../services/api";
import { Product, CategoryData, ProductsData } from "../../types";
import { generateProducts } from "../../utils/generateProducts";

import productsBackHero from "../../images/products-img.png";
import heroTea from "../../images/hero-tea.png";
import heroCoffee from "../../images/hero-coffee.png";
import heroCoffee2 from "../../images/hero-coffee-2.png";
import heroHealthy from "../../images/hero-zoj.png";
import heroVending from "../../images/hero-wending.png";

const buttonImageMap: Record<string, string> = {
  "src/images/hero-coffee.png": heroCoffee,
  "src/images/hero-coffee-2.png": heroCoffee2,
  "src/images/hero-tea.png": heroTea,
  "src/images/hero-zoj.png": heroHealthy,
  "src/images/hero-wending.png": heroVending,
};

const heroImages: Record<string, string> = {
  tea: heroTea,
  coffee: heroCoffee,
  healthy: heroHealthy,
  vending: heroVending,
};

const ProductCard = ({ product }: { product: Product }) => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useDispatch();
  const [selectedWeight, setSelectedWeight] = useState<string>("");

  useEffect(() => {
    if (Object.keys(product.weights).length > 0) {
      setSelectedWeight(Object.keys(product.weights)[0]);
    }
  }, [product.weights]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedWeight) return;

    const weightKey = selectedWeight;
    const price = product.weights[weightKey];

    dispatch(
      addToCart({
        id: product.id,
        title: product.cardTitle,
        description: product.cardDescription,
        image: product.cardImage,
        price: price,
        weight: weightKey,
        quantity: 1,
        discount: product.discount || false,
        category: category || "",
      })
    );
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedWeight(e.target.value);
  };

  const firstPrice = Object.values(product.weights)[0] || 0;
  const selectedPrice = selectedWeight ? product.weights[selectedWeight] : firstPrice;

  return (
    <Link to={`/catalog/${category}/${String(product.id)}`} className={style.cardLink}>
      <div className={style.productCard}>
        <div className={style.productsStarAndSelect}>
          <div className={style.productsStar}>
            <span className={style.star}>★</span>
            <span className={style.star}>★</span>
            <span className={style.star}>★</span>
            <span className={style.star}>★</span>
            <span className={style.star}>★</span>
          </div>
          <div className={style.productsSelect}>
            <select value={selectedWeight} onChange={handleWeightChange} onClick={(e) => e.stopPropagation()}>
              {Object.keys(product.weights).map((weight) => (
                <option key={weight} value={weight}>
                  {weight}гр
                </option>
              ))}
            </select>
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
            {selectedPrice} ₽
          </p>
          <button className={style.cardButton} onClick={handleAddToCart}>
            В корзину
          </button>
        </div>
      </div>
    </Link>
  );
};

export const Products = () => {
  const { category } = useParams<{ category: string }>();
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProductsData(data);
        if (category && data[category] && data[category].buttons && data[category].buttons.length > 0) {
          setSelectedButton(data[category].buttons[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedButton]);

  if (loading) {
    return (
      <div className={style.products}>
        <div className="container">
          <div className={style.productsContent}>
            <div className={style.productsGrid}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={style.productCard}>
                  <Skeleton height="200px" borderRadius="12px" />
                  <div style={{ padding: "15px" }}>
                    <Skeleton width="60%" height="24px" />
                    <Skeleton width="100%" height="40px" className={style.mt10} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                      <Skeleton width="30%" height="24px" />
                      <Skeleton width="40%" height="36px" borderRadius="20px" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productsData || !category || !productsData[category]) {
    return <div>Категория не найдена</div>;
  }

  const currentCategory = productsData[category];
  const heroImage = heroImages[category];

  const baseProductsForTab = (currentCategory.products && currentCategory.products[selectedButton || ''] || []) as Product[];
  
  const realProducts = baseProductsForTab;
  
  let generatedProducts: Product[] = [];
  
  if (realProducts.length < 40) {
    const fullGenerated = generateProducts(realProducts, selectedButton || '', category);
    const neededCount = 40 - realProducts.length;
    generatedProducts = fullGenerated.slice(0, neededCount);
  }
  
  const realDiscounted = realProducts.filter((p) => p.discount);
  const realRegular = realProducts.filter((p) => !p.discount);
  const generatedDiscounted = generatedProducts.filter((p) => p.discount);
  const generatedRegular = generatedProducts.filter((p) => !p.discount);
  
  let sortedProducts = [
    ...realDiscounted,
    ...realRegular,
    ...generatedDiscounted,
    ...generatedRegular
  ];
  
  if (sortOrder === 'asc') {
    sortedProducts = sortedProducts.sort((a, b) => {
      const priceA = Object.values(a.weights)[0];
      const priceB = Object.values(b.weights)[0];
      return priceA - priceB;
    });
  } else if (sortOrder === 'desc') {
    sortedProducts = sortedProducts.sort((a, b) => {
      const priceA = Object.values(a.weights)[0];
      const priceB = Object.values(b.weights)[0];
      return priceB - priceA;
    });
  }
  
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const showAll = visibleCount >= sortedProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className={style.products}>
      <div
        className={style.productsInner}
        style={{ backgroundImage: `url(${productsBackHero})` }}
      >
        <div className="container">
          <section className={style.productsHero}>
            <h1 className={style.productsHeading}>{currentCategory.title}</h1>
            <div className={style.productHeroImageWrap}>
              <img src={heroImage} alt="" className={style.productHeroImage} loading="lazy" />
            </div>
          </section>
        </div>
      </div>

      <div className={style.productsContent}>
        <div className="container">
          <section className={style.sortWrapper}>
            <button
              className={`${style.sortBtn} ${sortOrder === 'asc' ? style.active : ''}`}
              onClick={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
            >
              По возрастанию
            </button>
            <button
              className={`${style.sortBtn} ${sortOrder === 'desc' ? style.active : ''}`}
              onClick={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
            >
              По убыванию
            </button>
          </section>
          <section className={style.selectBtnsWrapper}>
            {currentCategory.buttons.map((button) => {
              const buttonImagePath = currentCategory.buttonImages?.[button];
              const buttonImage = buttonImagePath ? (buttonImageMap[buttonImagePath] || `/${buttonImagePath}`) : null;
              return (
                <div key={button} className={style.buttonCard}>
                  <button
                    className={`${style.selectBtn} ${selectedButton === button ? style.active : ""}`}
                    onClick={() => setSelectedButton(button)}
                  >
                    {buttonImage && (
                      <div className={style.buttonImageWrap}>
                        <img src={buttonImage} alt={button} className={style.buttonImage} />
                      </div>
                    )}
                    <span className={style.buttonText}>{button}</span>
                  </button>
                </div>
              );
            })}
          </section>

          <div className={style.productsGrid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!showAll && (
            <div className={style.loadMoreWrapper}>
              <button className={style.loadMoreBtn} onClick={handleLoadMore}>
                Показать еще
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
