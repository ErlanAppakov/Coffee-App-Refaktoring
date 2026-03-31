import style from "./news.module.css";

interface NewsListProps {
  image: string;
  title: string;
  subtitle: string;
}

export const NewsList = ({ image, title, subtitle }: NewsListProps) => {
  return (
    <div className={style.newsCard}>
      <div className={style.newsCardImagewrap}>
        <img src={image} alt={image} className={style.newsCardImage} loading="lazy" />
      </div>
      <div className={style.newsCardTextBlock}>
        <h4 className={style.newsCardTitle}>{title}</h4>
        <p className={style.newsCardSubTitle}>{subtitle}</p>
        <a href="/" className={style.newsLink}>
          Подробнее
        </a>
      </div>
    </div>
  );
};

