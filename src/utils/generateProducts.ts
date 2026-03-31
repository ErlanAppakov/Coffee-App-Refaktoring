import { Product } from "../types";

export const generateProducts = (baseProducts: Product[], buttonName: string, categoryName: string): Product[] => {
  const generated: Product[] = [];
  const productNames = [
    "Премиум", "Классический", "Эксклюзивный", "Традиционный", "Ароматный",
    "Насыщенный", "Нежный", "Бодрящий", "Успокаивающий", "Освежающий",
    "Пряный", "Сладкий", "Горький", "Кислый", "Дымный",
    "Цветочный", "Фруктовый", "Ореховый", "Шоколадный", "Ванильный",
    "Карамельный", "Медовый", "Цитрусовый", "Ягодный", "Травяной",
    "Душистый", "Богатый", "Изысканный", "Уникальный", "Особенный",
    "Редкий", "Отборный", "Высококачественный", "Элитный", "Премиальный",
    "Люкс", "Престижный", "Идеальный", "Лучший", "Топовый"
  ];
  
  const descriptions = [
    "Высококачественный продукт с насыщенным вкусом и ароматом",
    "Идеальное сочетание вкуса и качества для истинных ценителей",
    "Премиальный продукт, созданный по традиционным рецептам",
    "Уникальный вкус, который не оставит вас равнодушными",
    "Натуральный продукт без искусственных добавок",
    "Отборное сырье и бережная обработка для идеального результата",
    "Классический вкус, проверенный временем",
    "Современная интерпретация традиционного рецепта",
    "Эксклюзивная смесь для особых моментов",
    "Богатый и насыщенный вкус с долгим послевкусием"
  ];

  const defaultProduct: Product = {
    id: 0,
    gradeAndReviews: "4.0",
    reviews: "32 (отзыва)",
    cardImage: "src/images/discount-1.png",
    cardTitle: "Продукт",
    cardDescription: "Высококачественный продукт",
    weights: { "100": 250, "200": 450, "500": 950 },
    discount: false
  };

  const baseCount = baseProducts.length > 0 ? baseProducts.length : 1;
  const productsToUse = baseProducts.length > 0 ? baseProducts : [defaultProduct];
  
  for (let i = 0; i < 40; i++) {
    const baseProduct = productsToUse[i % baseCount];
    const nameIndex = i % productNames.length;
    const descIndex = i % descriptions.length;
    
    const basePrice = 200 + (i * 45) % 1800;
    const weights: Record<string, number> = {
      "100": basePrice,
      "200": Math.round(basePrice * 1.8),
      "500": Math.round(basePrice * 3.8),
      "1000": basePrice > 1000 ? Math.round(basePrice * 6.5) : Math.round(basePrice * 7.2)
    };

    generated.push({
      id: `${categoryName}_${buttonName}_${i + 1}`,
      gradeAndReviews: (4.0 + (i % 10) * 0.1).toFixed(1),
      reviews: `${20 + (i % 30)} (${i % 2 === 0 ? 'отзывов' : 'отзыва'})`,
      cardImage: baseProduct.cardImage || "src/images/discount-1.png",
      cardTitle: `${productNames[nameIndex]} ${buttonName}`,
      cardDescription: descriptions[descIndex],
      weights: weights,
      discount: i % 3 === 0,
    });
  }

  return generated;
};
