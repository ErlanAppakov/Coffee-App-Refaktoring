import style from '../../pages/products-page/products.module.css';

interface Product {
  id: string;
  gradeAndReviews: string;
  reviews: string;
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  cardPrice: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <div className={style.productCard}>
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
      {product.gradeAndReviews}{" "}
      <span className={style.reviews}>{product.reviews}</span>
    </p>

    <div className={style.cardImage}>
      <img src={product.cardImage} alt={product.cardTitle} />
    </div>

    <p className={style.cardTitle}>{product.cardTitle}</p>
    <p className={style.cardDescription}>{product.cardDescription}</p>

    <div className={style.cardPriceAnDButtonWrapper}>
      <p className={style.cardPrice}>{product.cardPrice}</p>
      <button className={style.cardButton}>В корзину</button>
    </div>
  </div>
);

