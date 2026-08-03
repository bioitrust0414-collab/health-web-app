// src/routes/bb-drink.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { getBBDrinkProducts } from '@/server/bb-drink';
import { HeroSection } from '@/components/bb-drink/HeroSection';
import { ProductGrid } from '@/components/bb-drink/ProductGrid';
import { CartDrawer } from '@/components/bb-drink/CartDrawer';

export const Route = createFileRoute('/bb-drink/')({
  component: BBDrinkPage,
  loader: async () => {
    const products = await getBBDrinkProducts();
    return { products };
  },
});

function BBDrinkPage() {
  const { products } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProductGrid products={products} />
      <CartDrawer />
    </div>
  );
}
