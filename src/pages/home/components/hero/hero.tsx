import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { heroAPI } from "../../../../services/api";
import style from "./hero.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroItem {
  id: string;
  title: string;
  subtitle: string;
  subtitleTwo: string;
  image: string;
}

export const Hero = () => {
  const [heroContent, setHeroContent] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await heroAPI.getAll();
        setHeroContent(data);
      } catch (error) {
        console.warn("Hero content not available (backend offline)");
        setHeroContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={style.hero}>
      <div className="container">
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
        >
          {heroContent.map(({ id, title, subtitle, subtitleTwo, image }) => (
            <SwiperSlide key={id}>
              <div className={style.heroContent}>
                <div className={style.textBlock}>
                  <h2 className={style.heroTitle}>{title}</h2>
                  <p className={style.heroSubtitle}>{subtitle}</p>
                  <p className={style.heroSubtitleTwo}>{subtitleTwo}</p>
                  <a className={style.heroAnchor} href="#catalog">
                    Посмотреть каталог
                  </a>
                </div>
                <div className={style.heroImage}>
                  <img src={image} alt="coffee" loading="lazy" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

