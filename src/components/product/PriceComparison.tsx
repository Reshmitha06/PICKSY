import { ProductListing } from "@/lib/types";
import { getStoreUrl } from "@/lib/store-urls";

interface PriceComparisonProps {
  listings: ProductListing[];
  productName: string;
}

const storeLogos: Record<string, { name: string; color: string }> = {
  amazon: { name: "Amazon", color: "bg-orange-500" },
  flipkart: { name: "Flipkart", color: "bg-blue-500" },
  croma: { name: "Croma", color: "bg-green-600" },
  "reliance-digital": { name: "Reliance Digital", color: "bg-red-500" },
  "vijay-sales": { name: "Vijay Sales", color: "bg-yellow-500" },
};

export default function PriceComparison({ listings, productName }: PriceComparisonProps) {
  const sortedListings = [...listings].sort((a, b) => a.price - b.price);
  const bestPrice = sortedListings[0]?.price;

  return (
    <div className="card rounded-[14px] p-6">
      <h3 className="section-label">
        Price Comparison
      </h3>
      <p className="mt-1.5 text-[13px] text-zinc-500">
        Across {listings.length} stores
      </p>

      <div className="mt-5 space-y-2.5">
        {sortedListings.map((listing) => {
          const store = storeLogos[listing.store] || {
            name: listing.store,
            color: "bg-zinc-500",
          };
          const isBest = listing.price === bestPrice;
          const savings = listing.originalPrice
            ? listing.originalPrice - listing.price
            : 0;
          const url = listing.productUrl !== "#"
            ? listing.productUrl
            : getStoreUrl(listing.store, productName);

          return (
            <div
              key={listing.store}
              className={`relative flex flex-col gap-3 rounded-[10px] border p-4 transition-all ${
                isBest
                  ? "border-violet-500/20 bg-violet-500/[0.03]"
                  : "border-white/[0.04] bg-white/[0.02]"
              }`}
            >
              {isBest && (
                <span className="font-mono absolute -top-2 left-3 rounded-md bg-violet-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                  Best Price
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold text-white ${store.color}`}
                  >
                    {store.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-300">
                      {store.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-zinc-600">
                        ★ {listing.rating} ({listing.reviewCount.toLocaleString("en-IN")})
                      </span>
                      {listing.inStock ? (
                        <span className="text-[10px] text-emerald-400/70">In Stock</span>
                      ) : (
                        <span className="text-[10px] text-red-400/70">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-base font-bold text-white">
                    ₹{listing.price.toLocaleString("en-IN")}
                  </p>
                  {savings > 0 && (
                    <p className="font-mono text-[10px] text-emerald-400">
                      Save ₹{savings.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>

              {/* Buy Now button */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold transition-all ${
                  isBest
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                Buy on {store.name}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
