import CategoryCard from "@/components/ui/CategoryCard";
import { categories } from "@/lib/mock-data";

export default function PopularCategories() {
  return (
    <section className="relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-label tracking-[0.05em]">Explore</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Browse by category
          </h2>
          <p className="mt-3 text-[15px] text-zinc-500/70">
            Products we&apos;ve researched and compared for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 [&>*:nth-child(1)]:col-span-2 [&>*:nth-child(1)]:row-span-2 [&>*:nth-child(4)]:col-span-2">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
