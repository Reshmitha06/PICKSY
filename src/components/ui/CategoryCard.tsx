import Link from "next/link";
import { CategoryInfo } from "@/lib/types";

interface CategoryCardProps {
  category: CategoryInfo;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/search?q=${category.slug}&category=${category.slug}`}
      className="group block"
    >
      <div className="card-glow rounded-[14px] p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-2xl">
          {category.icon}
        </div>
        <h3 className="mt-3.5 text-[15px] font-semibold text-white">
          {category.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{category.description}</p>
        <p className="font-mono mt-3.5 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-violet-400">
          {category.productCount}+ products
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </p>
      </div>
    </Link>
  );
}
