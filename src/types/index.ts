export interface Product {
  id: string | number;
  gradeAndReviews: string;
  reviews: string;
  cardImage: string;
  cardTitle: string;
  cardDescription: string;
  weights: Record<string, number>;
  discount?: boolean;
}

export interface CategoryData {
  title: string;
  buttons: string[];
  buttonImages?: Record<string, string>;
  products: Record<string, Product[]>;
}

export interface ProductsData {
  [key: string]: CategoryData;
}

export interface CartItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  price: number;
  weight: string;
  quantity: number;
  discount?: boolean;
  category?: string;
}
