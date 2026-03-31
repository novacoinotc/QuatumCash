import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
