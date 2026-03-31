"use client";

import { useCounterAnimation } from "@/hooks/useCounterAnimation";

interface StatCardProps {
  target: number;
  suffix: string;
  decimal?: boolean;
  label: string;
  detail: string;
  scrub?: boolean;
}

export default function StatCard({
  target,
  suffix,
  decimal = false,
  label,
  detail,
  scrub = false,
}: StatCardProps) {
  const counterRef = useCounterAnimation({ target, suffix, decimal, scrub });

  return (
    <div className="glass-card group rounded-2xl p-8 text-center">
      <div
        ref={counterRef}
        className="stat-number mb-2 font-[var(--font-primary)] text-4xl font-bold text-white transition-colors duration-300 group-hover:text-[var(--glow-primary)]"
      >
        0
      </div>
      <div className="mb-1 text-sm font-semibold text-[var(--glow-primary)]">
        {label}
      </div>
      <div className="text-xs text-[var(--text-muted)]">{detail}</div>
    </div>
  );
}
