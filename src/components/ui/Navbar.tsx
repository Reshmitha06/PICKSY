"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [navQuery, setNavQuery] = useState("");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = navQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setNavQuery("");
  }

  const isSearchPage = pathname === "/search";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#121212]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Picksy
          </span>
        </Link>

        {/* Compact search bar — appears after scrolling past fold (not on search page) */}
        {scrolled && !isSearchPage && (
          <form onSubmit={handleNavSearch} className="hidden flex-1 max-w-md mx-8 sm:flex">
            <div className="relative flex w-full items-center rounded-lg border border-white/[0.08] bg-white/[0.04] transition-all focus-within:border-violet-500/30">
              <svg className="ml-3 h-4 w-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border-none bg-transparent px-3 py-2 text-[13px] text-white outline-none placeholder:text-zinc-600"
              />
            </div>
          </form>
        )}

        {/* Nav Links — shown when not scrolled or on mobile */}
        {!scrolled && (
          <div className="hidden items-center gap-0.5 sm:flex">
            {[
              { href: "/", label: "Home" },
              { href: "/search?q=smartphones", label: "Phones" },
              { href: "/search?q=laptops", label: "Laptops" },
              { href: "/search?q=earbuds", label: "Earbuds" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  pathname === href
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* CTA + Badge */}
        <div className="flex items-center gap-3">
          <span className="font-mono hidden rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-500 sm:inline-block">
            Beta
          </span>
          <Link
            href="/search"
            className="rounded-lg bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
