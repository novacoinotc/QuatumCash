"use client";

import type { ReactNode } from "react";

const ICONS: Record<string, ReactNode> = {
  exchange: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  dollar: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  shield: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  card: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  code: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  search: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
};

interface ServiceCardProps {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

export default function ServiceCard({
  icon,
  title,
  desc,
  tags,
}: ServiceCardProps) {
  return (
    <div className="card-hover group rounded-2xl border border-[var(--dark-border)] bg-[var(--dark-card)]/60 p-8 backdrop-blur-sm">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--purple)]/10 text-[var(--purple-light)] transition-all duration-500 group-hover:bg-[var(--purple)]/20 group-hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] group-hover:scale-110">
        {ICONS[icon]}
      </div>
      <h3 className="mb-3 font-[var(--font-primary)] text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[var(--purple-light)]">
        {title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-[var(--gray-400)]">
        {desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-[var(--purple)]/8 px-3 py-1 text-xs font-medium text-[var(--purple-light)] transition-colors duration-300 group-hover:bg-[var(--purple)]/15"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
