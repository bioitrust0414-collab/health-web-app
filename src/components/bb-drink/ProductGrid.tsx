// src/components/bb-drink/ProductGrid.tsx
import { Link } from '@tanstack/react-router';
import { useCartStore } from '@/lib/cart';
import type { BBDrinkProduct } from '@/types/bb-drink';

interface ProductGridProps {
  products: BBDrinkProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section id="products" className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">精選商品</h2>
          <p className="mt-2 text-gray-600">為你的健康把關，每一口都是天然的承諾</p>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">
            商品即將上架，敬請期待。
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                {product.is_new && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    新品
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    熱銷
                  </span>
                )}

                <Link to="/bb-drink/$productId" params={{ productId: product.sku }}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url ?? undefined}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <Link
                    to="/bb-drink/$productId"
                    params={{ productId: product.sku }}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.description}</p>
                    )}
                  </Link>

                  {product.flavor && (
                    <p className="mt-2 text-xs text-gray-500">口味：{product.flavor}</p>
                  )}
                  {product.net_weight && (
                    <p className="text-xs text-gray-500">規格：{product.net_weight}</p>
                  )}

                  <div className="mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-emerald-700">
                        NT${product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">
                          NT${product.original_price}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="mt-3 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                    >
                      加入購物車
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
