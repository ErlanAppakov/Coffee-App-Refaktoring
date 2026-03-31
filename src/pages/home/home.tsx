import { CatalogHomePage } from "./components/catalog-home-page/catalog-home-page";
import { Hero } from "./components/hero/hero";
import { Benefits } from "./components/benefits/benefits";
import { News } from "./components/news/news";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <CatalogHomePage />
      <Benefits />
      <News />
    </>
  );
};

