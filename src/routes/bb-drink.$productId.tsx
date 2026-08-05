// src/routes/bb-drink.$productId.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { getBBDrinkProductById } from '@/api/bb-drink';
import { useCartStore } from '@/lib/cart';

export const Route = createFileRoute('/bb-drink/$productId')({
  component: ProductDetailPage,
  loader: async ({ params }) => {
    const product = await getBBDrinkProductById({ data: params.productId });
    return { product };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">商品載入失敗</h1>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <Link to="/bb-drink" className="mt-4 inline-block text-emerald-600 underline">
        返回商品列表
      </Link>
    </div>
  ),
  notFoundComponent: () => <div className="p-6">找不到商品</div>,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-gray-500">
          <Link to="/bb-drink" className="hover:text-emerald-600">
            健康好夥伴
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* 圖片 */}
          <div className="overflow-hidden rounded-2xl bg-gray-50">
            <img
              src={product.image_url ?? undefined}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* 資訊 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.description && (
                <p className="mt-2 text-lg text-gray-600">{product.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-emerald-700">NT${product.price}</span>
              {product.original_price && (
                <span className="text-lg text-gray-400 line-through">
                  NT${product.original_price}
                </span>
              )}
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-6">
              {(product.flavor || product.net_weight) && (
                <div>
                  <h2 className="font-semibold text-gray-900">產品規格</h2>
                  <p className="mt-1 text-gray-600">
                    {[
                      product.flavor ? `口味：${product.flavor}` : null,
                      product.net_weight ? `淨重：${product.net_weight}` : null,
                    ]
                      .filter(Boolean)
                      .join(' / ')}
                  </p>
                </div>
              )}
              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-900">產品特色</h2>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                    {product.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h2 className="font-semibold text-gray-900">主要成分</h2>
                  <p className="mt-1 text-gray-600">{product.ingredients.join('、')}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addItem(product, qty)}
                className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
