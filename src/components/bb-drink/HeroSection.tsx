// src/components/bb-drink/HeroSection.tsx
import { Link } from '@tanstack/react-router';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="absolute inset-0 opacity-10 bg-[url('/assets/bb-drink/pattern.svg')]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
              ✨ 全新上市
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              BB 神采速纖飲
            </h1>
            <p className="text-lg text-emerald-50 sm:text-xl">
              天然植萃配方，輕盈無負擔。每日一杯，喚醒你的神采與活力。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/bb-drink"
                hash="products"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
              >
                立即選購
              </Link>
              <Link
                to="/bb-drink"
                hash="about"
                className="inline-flex items-center rounded-xl border-2 border-white/30 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/10"
              >
                了解更多
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span> 全天然成分
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span> SGS 檢驗合格
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚚</span> 全台免運
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/bb-drink/hero-product.png"
              alt="BB 神采速纖飲"
              className="mx-auto w-full max-w-md drop-shadow-2xl lg:max-w-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
