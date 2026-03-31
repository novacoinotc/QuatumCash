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
    "inline-flex items-center justify-center gap-2.5 font-[var(--font-primary)] font-semibold rounded-xl border-none cursor-pointer relative overflow-hidden transition-all active:scale-[0.97]";
  const sizes = {
    default: "text-[0.95rem] px-8 py-3.5 min-h-12",
    lg: "text-base px-10 py-4 min-h-14",
  };
  const variants = {
    primary:
      "bg-gradient-to-br from-cyan-500 via-violet-600 to-violet-500 text-white shadow-[0_4px_24px_rgba(0,240,255,0.2)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,240,255,0.3)] hover:brightness-110 duration-400",
    outline:
      "bg-transparent text-white border border-[var(--border-default)] hover:border-[var(--border-glow)] hover:bg-[rgba(0,240,255,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,240,255,0.1)] duration-400",
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
