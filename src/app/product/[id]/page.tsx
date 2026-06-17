import { notFound } from "next/navigation";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";
import ProductSpecs from "@/components/product/ProductSpecs";
import ProsCons from "@/components/product/ProsCons";
import PriceComparison from "@/components/product/PriceComparison";
import ScoreBreakdown from "@/components/product/ScoreBreakdown";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const categoryEmoji =
    product.category === "smartphones"
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
      : "🌬️";

  const discount = product.listings[0]?.originalPrice
    ? Math.round(
        ((product.listings[0].originalPrice - product.bestPrice) /
          product.listings[0].originalPrice) *
          100
      )
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      {/* Breadcrumb */}
      <nav className="font-mono flex items-center gap-2 text-[11px] text-zinc-600">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Home
        </Link>
        <span className="text-zinc-700">/</span>
        <Link
          href={`/search?q=${product.category}`}
          className="capitalize hover:text-zinc-300 transition-colors"
        >
          {product.category.replace("-", " ")}
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">{product.canonicalName}</span>
      </nav>

      {/* Header */}
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="card-glow flex items-center justify-center rounded-[14px] p-12">
          <div className="flex h-56 w-56 items-center justify-center rounded-xl bg-white/[0.03] text-8xl">
            {categoryEmoji}
          </div>
        </div>

        {/* Info */}
        <div>
          {/* Brand */}
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-600">
            {product.brand}
          </p>
          {/* Name */}
          <h1 className="font-display mt-2.5 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {product.canonicalName}
          </h1>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-md bg-emerald-500/8 px-2.5 py-1">
              <span className="font-mono text-[12px] font-semibold text-emerald-400">
                ★ {product.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-[13px] text-zinc-500">
              {product.totalReviews.toLocaleString("en-IN")} reviews across{" "}
              {product.listings.length} stores
            </span>
          </div>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-2.5">
            <span className="font-mono text-3xl font-bold text-white">
              ₹{product.bestPrice.toLocaleString("en-IN")}
            </span>
            {product.listings[0]?.originalPrice && (
              <span className="font-mono text-base text-zinc-600 line-through">
                ₹{product.listings[0].originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discount > 0 && (
              <span className="font-mono rounded-md bg-emerald-500/8 px-2.5 py-1 text-[12px] font-semibold text-emerald-400">
                {discount}% off
              </span>
            )}
          </div>

          {/* Picksy Score — inline */}
          <div className="mt-6 inline-flex items-center gap-3.5 rounded-[10px] border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            <span className="section-label">
              Picksy Score
            </span>
            <span className="font-mono text-2xl font-bold text-violet-400">
              {product.scores.overall}<span className="text-sm text-zinc-600">/100</span>
            </span>
          </div>

          {/* Highlights */}
          <div className="mt-6">
            <h3 className="section-label">Highlights</h3>
            <ul className="mt-3 space-y-2">
              {product.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] leading-relaxed text-zinc-400"
                >
                  <span className="mt-0.5 text-violet-400/60">•</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detail sections */}
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ProsCons pros={product.pros} cons={product.cons} />
          <ProductSpecs specs={product.specifications} />
        </div>
        <div className="space-y-5">
          <PriceComparison listings={product.listings} productName={product.canonicalName} />
          <ScoreBreakdown scores={product.scores} />
        </div>
      </div>
    </div>
  );
}
