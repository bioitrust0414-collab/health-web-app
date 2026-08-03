// src/api/bb-drink.ts
import { createServerFn } from '@tanstack/react-start';
import { findBBDrinkProduct, listBBDrinkProducts } from './bb-drink.server';

export const fetchBBDrinkData = createServerFn({ method: 'GET' }).handler(async () => listBBDrinkProducts());

export const getBBDrinkProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const product = await findBBDrinkProduct(id);
    if (!product) throw new Error('找不到商品');
    return product;
  });
