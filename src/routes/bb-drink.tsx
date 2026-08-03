// src/routes/bb-drink.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/bb-drink')({
  component: BBDrinkLayout,
});

function BBDrinkLayout() {
  return <Outlet />;
}
