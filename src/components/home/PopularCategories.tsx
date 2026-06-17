import CategoryCard from "@/components/ui/CategoryCard";
import { categories } from "@/lib/mock-data";

export default function PopularCategories() {
  return (
    <section className="relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-label">Explore</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Browse by category
          </h2>
          <p className="mt-3 text-[15px] text-zinc-500">
            Products we&apos;ve researched and compared for you.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
