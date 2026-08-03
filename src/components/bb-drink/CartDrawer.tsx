// src/components/bb-drink/CartDrawer.tsx
import { useState } from 'react';
import { useCartStore } from '@/lib/cart';
import { Link } from '@tanstack/react-router';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

  if (totalItems === 0) return null;

  return (
    <>
      {/* 浮動按鈕 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition hover:scale-110 hover:bg-emerald-700"
      >
        <span className="text-2xl">🛒</span>
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {totalItems}
        </span>
      </button>

      {/* 抽屜 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-bold">購物車 ({totalItems})</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-center text-gray-500">購物車是空的</p>
              ) : (
                <div className="space-y-4">
                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex gap-4 rounded-xl border p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-500">NT${product.price}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="rounded bg-gray-100 px-2 py-0.5"
                          >
                            −
                          </button>
                          <span className="w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="rounded bg-gray-100 px-2 py-0.5"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="ml-auto text-sm text-red-500 hover:underline"
                          >
                            移除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-4">
              <div className="mb-4 flex justify-between text-lg font-bold">
                <span>合計</span>
                <span>NT${totalPrice}</span>
              </div>
              <Link
                to="/checkout"
                className="block w-full rounded-xl bg-emerald-600 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
                onClick={() => setIsOpen(false)}
              >
                前往結帳
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
