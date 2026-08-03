// src/types/bb-drink.ts
export interface BBDrinkProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  flavor: string;
  netWeight: string;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: BBDrinkProduct;
  quantity: number;
}
