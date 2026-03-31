import style from "./benefits.module.css";
import BenefitsBack from "../../../../images/benefits-back.png";
import BenefitsAndBeanBackImage from "../../../../images/BenefitsAndBeanBack.png";
import BenefitscoffeeImages from "../../../../images/benefits-coffee.png";
import BenefitsRoastingIcon from "../../../../images/benefits-roasting.svg";
import BenefitsBestPrices from "../../../../images/benefits-best-prices.svg";
import BenefitsConsultationsIcon from "../../../../images/benefits-consultations.svg";
import { BeanToCup } from "../bean-to-cup/bean-to-cup";

export const Benefits = () => {
  return (
    <section
      className={style.benefitsAndBeanWrap}
      style={{ backgroundImage: `url(${BenefitsAndBeanBackImage})` }}
    >
      <div className={style.benefits}>
        <div className="container">
          <h2 className={style.benefitsTitle}>
            Почему стоит работать именно с нами?
          </h2>
          <div className={style.benefitsContentBlock}>
            <div className={style.benefitsCoffeeImageWrap}>
              <img src={BenefitscoffeeImages} alt="" loading="lazy" />
            </div>
            <div className={style.benefitsFlex}>
              <div className={style.benefitsDescriptionBlock}>
                <div className={style.benefitsIconWrap}>
                  <img src={BenefitsRoastingIcon} alt="" loading="lazy" />
                </div>
                <div className={style.benefitsTextWrap}>
                  <p className={style.benefitsTextTitle}>
                    Всегда свежая обжарка
                  </p>
                  <p className={style.benefitsTextSubtitle}>
                    Подбор степени обжарки под каждый сорт кофе. Всегда свежая
                    обжарка
                  </p>
                </div>
              </div>
              <div className={style.benefitsDescriptionBlock}>
                <div className={style.benefitsIconWrap}>
                  <img src={BenefitsBestPrices} alt="" loading="lazy" />
                </div>
                <div className={style.benefitsTextWrap}>
                  <p className={style.benefitsTextTitle}>
                    Лучшие цены на продукцию
                  </p>
                  <p className={style.benefitsTextSubtitle}>
                    Благодаря крупным объемам производства мы даем лучшие цены
                    на нашу продукцию
                  </p>
                </div>
              </div>
              <div className={style.benefitsDescriptionBlock}>
                <div className={style.benefitsIconWrap}>
                  <img src={BenefitsConsultationsIcon} alt="" loading="lazy" />
                </div>
                <div className={style.benefitsTextWrap}>
                  <p className={style.benefitsTextTitle}>Консультации 24/7</p>
                  <p className={style.benefitsTextSubtitle}>
                    Наши специалисты готовы всегда помочь и подсказать вам с
                    выбором кофе или другой продукции.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BeanToCup />
    </section>
  );
};

