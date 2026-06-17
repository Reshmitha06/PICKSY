"use client";

import SearchBox from "@/components/ui/SearchBox";
import { popularSearches } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden">
      {/* Grid background pattern */}
      <div className="grid-pattern absolute inset-0" />

      {/* Ambient glows — Vercel style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ambient-glow -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-violet-600/[0.07]" />
        <div className="ambient-glow -right-40 top-20 h-[300px] w-[300px] bg-purple-500/[0.05]" />
        <div className="ambient-glow -left-40 top-40 h-[250px] w-[250px] bg-indigo-500/[0.04]" />
      </div>

      {/* Fade overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#121212] to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 pb-32 pt-24 sm:pt-32 lg:px-8">
        {/* Badge — Linear style */}
        <div className="flex justify-center animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[12px] font-medium text-zinc-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-powered smart shopping
          </span>
        </div>

        {/* Headline — Raycast "Your shortcut to everything" style */}
        <h1 className="font-display mt-8 text-center text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl sm:leading-[1.05] lg:text-7xl lg:leading-[1.05] animate-fade-in">
          Stop searching.
          <br />
          <span className="gradient-text">Start deciding.</span>
        </h1>

        {/* Subtitle — one crisp line like Vercel */}
        <p className="mx-auto mt-6 max-w-lg text-center text-[17px] leading-relaxed text-zinc-500/70 animate-fade-in">
          Picksy finds products across every store, compares them with AI, and tells you exactly what to buy.
        </p>

        {/* Search Box */}
        <div className="mt-10 animate-fade-in">
          <SearchBox size="large" />
        </div>

        {/* Popular Searches — pill style */}
        <div className="mt-6 text-center animate-fade-in">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[12px] text-zinc-500 mr-1">Try:</span>
            {popularSearches.slice(0, 4).map((search) => (
              <button
                key={search}
                onClick={() =>
                  router.push(`/search?q=${encodeURIComponent(search)}`)
                }
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-zinc-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white hover:shadow-lg hover:shadow-violet-500/5"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Trust stats — Raycast style compact */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center animate-fade-in">
          {[
            { value: "5+", label: "Stores" },
            { value: "7", label: "Categories" },
            { value: "AI", label: "Ranked" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-10">
              <div>
                <span className="font-mono block text-2xl font-bold text-white">{stat.value}</span>
                <span className="mt-0.5 block text-[12px] text-zinc-500">{stat.label}</span>
              </div>
              {i < 2 && <div className="h-8 w-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
