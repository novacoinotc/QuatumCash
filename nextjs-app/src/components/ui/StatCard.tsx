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
    <div className="card-hover group rounded-2xl border border-[var(--dark-border)] bg-[var(--dark-card)]/60 p-8 text-center backdrop-blur-sm">
      <div
        ref={counterRef}
        className="mb-2 font-[var(--font-primary)] text-4xl font-bold text-white transition-colors duration-300 group-hover:text-[var(--purple-light)]"
      >
        0
      </div>
      <div className="mb-1 text-sm font-semibold text-[var(--purple-light)]">
        {label}
      </div>
      <div className="text-xs text-[var(--gray-500)]">{detail}</div>
    </div>
  );
}
