import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={24} />
              <span className="font-display text-base font-bold text-white">Picksy</span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-zinc-500">
              Stop searching. Start deciding. AI-powered product recommendations across every store.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="section-label">Categories</h3>
            <ul className="mt-4 space-y-2.5">
              {["Smartphones", "Laptops", "Earbuds", "Televisions"].map(
                (cat) => (
                  <li key={cat}>
                    <a
                      href={`/search?q=${cat.toLowerCase()}`}
                      className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {cat}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="section-label">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="section-label">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {["Privacy", "Terms", "Cookies"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 sm:flex-row">
          <p className="text-[12px] text-zinc-600">
            &copy; {new Date().getFullYear()} Picksy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors">X (Twitter)</a>
            <a href="#" className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="#" className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
