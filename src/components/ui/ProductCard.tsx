import Link from "next/link";
import { NormalizedProduct } from "@/lib/types";
import { StoreIcon } from "./StoreIcons";

interface ProductCardProps {
  product: NormalizedProduct;
  badge?: "best-overall" | "best-value" | "premium-pick";
}

const badgeConfig = {
  "best-overall": {
    label: "Best Overall",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  "best-value": {
    label: "Best Value",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  "premium-pick": {
    label: "Premium",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
};

export default function ProductCard({ product, badge }: ProductCardProps) {
  const discount = product.listings[0]?.originalPrice
    ? Math.round(
        ((product.listings[0].originalPrice - product.bestPrice) /
          product.listings[0].originalPrice) *
          100
      )
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="card-glow relative overflow-hidden rounded-[14px]">
        {/* Badge */}
        {badge && (
          <div className="absolute left-3 top-3 z-10">
            <span
              className={`font-mono inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium ${badgeConfig[badge].className}`}
            >
              {badgeConfig[badge].label}
            </span>
          </div>
        )}

        {/* Image area */}
        <div className="flex h-44 items-center justify-center bg-white/[0.02] p-6">
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/[0.03] text-5xl">
            {product.category === "smartphones"
              ? "📱"
              : product.category === "laptops"
              ? "💻"
              : product.category === "earbuds"
              ? "🎧"
              : product.category === "televisions"
              ? "📺"
              : product.category === "refrigerators"
              ? "❄️"
              : product.category === "washing-machines"
              ? "🫧"
              : "🌬️"}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand */}
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-600">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="mt-1.5 text-[14px] font-semibold leading-snug text-zinc-200 line-clamp-2 group-hover:text-white transition-colors">
            {product.canonicalName}
          </h3>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-emerald-500/8 px-2 py-0.5">
              <span className="font-mono text-[11px] font-semibold text-emerald-400">
                ★ {product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-zinc-600">
              {product.totalReviews.toLocaleString("en-IN")} reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-white">
              ₹{product.bestPrice.toLocaleString("en-IN")}
            </span>
            {product.listings[0]?.originalPrice && (
              <span className="font-mono text-[12px] text-zinc-600 line-through">
                ₹{product.listings[0].originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="font-mono text-[11px] font-semibold text-emerald-400">
                {discount}% off
              </span>
            )}
          </div>

          {/* Stores */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.listings.map((listing) => (
              <StoreIcon key={listing.store} store={listing.store} size={18} />
            ))}
          </div>

          {/* Score bar */}
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-600">Match Score</span>
              <span className="font-mono text-[11px] font-semibold text-violet-400">
                {product.scores.overall}/100
              </span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all"
                style={{ width: `${product.scores.overall}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
