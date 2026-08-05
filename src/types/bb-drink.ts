// src/types/bb-drink.ts
// 欄位名稱直接對應 Supabase products 表，避免前後端再做一層映射。
export interface BBDrinkProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  sub_category: string | null;
  brand: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  stock_quantity: number;
  health_tags: string[] | null;
  ingredients: string[] | null;
  benefits: string[] | null;
  flavor: string | null;
  net_weight: string | null;
  is_best_seller: boolean | null;
  is_new: boolean | null;
}

export interface CartItem {
  product: BBDrinkProduct;
  quantity: number;
}
