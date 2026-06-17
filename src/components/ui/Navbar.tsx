"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Picksy
          </span>
        </Link>

        {/* Nav Links — Vercel/Linear style */}
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
