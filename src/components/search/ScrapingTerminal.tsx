"use client";

import { useState, useEffect } from "react";

const SCRAPING_STEPS = [
  { text: "Searching Amazon.in...", store: "amazon" },
  { text: "Searching Flipkart...", store: "flipkart" },
  { text: "Searching Croma...", store: "croma" },
  { text: "Analyzing specifications...", store: null },
  { text: "Comparing prices...", store: null },
  { text: "Reading user reviews...", store: null },
  { text: "Calculating Picksy Score...", store: null },
  { text: "Ranking results...", store: null },
];

export default function ScrapingTerminal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (currentStep >= SCRAPING_STEPS.length) return;

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, SCRAPING_STEPS[currentStep].text]);
      setCurrentStep((s) => s + 1);
    }, 400 + Math.random() * 300);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0f] overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono ml-2 text-[10px] text-zinc-600">picksy — search engine</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[11px] leading-6 min-h-[160px]">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-zinc-400">{log}</span>
          </div>
        ))}
        {currentStep < SCRAPING_STEPS.length && (
          <div className="flex items-center gap-2">
            <span className="text-violet-400 animate-pulse">●</span>
            <span className="text-zinc-500">
              {SCRAPING_STEPS[currentStep].text}
            </span>
            <span className="terminal-cursor text-violet-400">▌</span>
          </div>
        )}
        {currentStep >= SCRAPING_STEPS.length && (
          <div className="mt-2 flex items-center gap-2 text-emerald-400">
            <span>⚡</span>
            <span>Done! Rendering results...</span>
          </div>
        )}
      </div>
    </div>
  );
}
