import type { ReactNode, AnchorHTMLAttributes } from "react";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 font-[var(--font-primary)] font-semibold rounded-xl border-none cursor-pointer transition-[transform,box-shadow] duration-400 relative overflow-hidden";
  const sizes = {
    default: "text-[0.95rem] px-8 py-3.5 min-h-12",
    lg: "text-base px-10 py-4 min-h-14",
  };
  const variants = {
    primary:
      "bg-gradient-to-br from-[var(--blue)] via-[var(--purple)] to-[var(--pink)] text-white shadow-[0_4px_24px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]",
    outline:
      "bg-transparent text-white border border-[var(--dark-border)] hover:border-[var(--purple)]/50 hover:bg-[var(--purple)]/5 hover:-translate-y-0.5",
  };

  return (
    <a
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
