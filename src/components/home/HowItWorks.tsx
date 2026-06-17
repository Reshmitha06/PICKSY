export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Describe your need",
      description:
        "Tell us what you want in plain language. No filters, no complexity.",
      icon: "💬",
    },
    {
      number: "02",
      title: "We search everywhere",
      description:
        "Picksy crawls Amazon, Flipkart, Croma, and more in real time.",
      icon: "🔍",
    },
    {
      number: "03",
      title: "AI ranks results",
      description:
        "Our engine analyzes specs, reviews, and prices — then scores each product.",
      icon: "🧠",
    },
    {
      number: "04",
      title: "Buy with confidence",
      description:
        "Get a clear recommendation with the best match and where to buy it.",
      icon: "✅",
    },
  ];

  return (
    <section className="relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-label text-violet-400/80">How it works</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            From search to decision
          </h2>
          <p className="mt-3 text-[15px] text-zinc-500">
            Under 2 minutes. Every time.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="card-glow rounded-[14px] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-2xl">
                {step.icon}
              </div>
              <span className="font-mono mt-5 inline-block text-[11px] font-semibold text-violet-400/70">
                Step {step.number}
              </span>
              <h3 className="mt-1.5 text-[15px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
