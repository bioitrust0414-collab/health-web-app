// src/routes/bb-drink.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CartDrawer } from '@/components/bb-drink/CartDrawer';

export const Route = createFileRoute('/bb-drink')({
  component: BBDrinkLayout,
});

function BBDrinkLayout() {
  return (
    <>
      <Outlet />
      <CartDrawer />
    </>
  );
}
