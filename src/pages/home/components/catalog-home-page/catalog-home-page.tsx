import { useEffect, useState } from "react";
import style from "./catalog-home.module.css";
import { catalogAPI } from "../../../../services/api";
import catalogHomeImage from "../../../../images/catalog-home.png";
import { DiscountSection } from "../discount-section/discount-section";
import { Link } from "react-router-dom";

interface CatalogItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

export const CatalogHomePage = () => {
  const [catalogProductsListDb, setCatalogProductsListDb] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await catalogAPI.getAll();
        setCatalogProductsListDb(data);
      } catch (error) {
        console.warn("Catalog not available (backend offline)");
        setCatalogProductsListDb([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (loading) {
    return (
      <section
        className={style.catalogList}
        style={{ backgroundImage: `url(${catalogHomeImage})` }}
      >
        <div className="container">
          <div>Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={style.catalogList}
      style={{ backgroundImage: `url(${catalogHomeImage})` }}
    >
      <div className="container">
        <h2 id="catalog" className={style.catalogProductsTitle}>
          Каталоги нашей продукции
        </h2>
        {catalogProductsListDb.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>Каталог временно недоступен. Запустите backend сервер для загрузки данных.</p>
          </div>
        ) : (
          <ul className={style.catalogProductsList}>
            {catalogProductsListDb.map(({ id, title, image, category }) => (
              <li key={id}>
                <div className={style.catalogProductsCard}>
                  <div className={style.catalogProductsCardImageWrapper}>
                    <img 
                      src={image.startsWith('/') ? image : `/${image}`} 
                      alt={title}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('catalog-home.png')) {
                          target.src = '/src/images/catalog-home.png';
                        }
                      }}
                    />
                  </div>
                  <p className={style.title}>{title}</p>
                  <Link to={`/catalog/${category}`} className={style.catalogBuy}>
                    Купить
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DiscountSection />
    </section>
  );
};

