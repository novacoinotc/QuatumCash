"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { STATS } from "@/lib/constants";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;

    if (prefersReduced) {
      gsap.set([header, ...Array.from(grid.children)], { opacity: 1, y: 0 });
      return;
    }

    // Scrub-based timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: isMobile ? "top 85%" : "top 75%",
        end: isMobile ? "center center" : "50% center",
        scrub: 1,
      },
    });

    tl.from(header, {
      opacity: 0,
      y: isMobile ? 20 : 40,
      duration: 1,
      ease: "power3.out",
    });

    tl.from(
      grid.children,
      {
        opacity: 0,
        y: isMobile ? 20 : 40,
        scale: 0.9,
        duration: 0.8,
        stagger: isMobile ? 0.05 : 0.1,
        ease: "power3.out",
      },
      "-=0.5"
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="estadisticas"
      className="relative overflow-x-clip py-[var(--section-padding)]"
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="grid-g"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <line x1="0" y1="80" x2="1200" y2="80" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="0" y1="160" x2="1200" y2="160" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="0" y1="240" x2="1200" y2="240" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="0" y1="320" x2="1200" y2="320" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="400" y1="0" x2="400" y2="400" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="600" y1="0" x2="600" y2="400" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="800" y1="0" x2="800" y2="400" stroke="url(#grid-g)" strokeWidth="0.5" />
        <line x1="1000" y1="0" x2="1000" y2="400" stroke="url(#grid-g)" strokeWidth="0.5" />
        <circle cx="600" cy="200" r="2.5" fill="#F472B6" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div ref={headerRef} className="mb-12 text-center">
          <span className="mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            Resultados que Hablan
          </span>
          <h2 className="font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
            Numeros que respaldan
            <br />
            <span className="gradient-text">cada palabra</span>
          </h2>
        </div>
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              decimal={stat.decimal}
              label={stat.label}
              detail={stat.detail}
              scrub
            />
          ))}
        </div>
      </div>
    </section>
  );
}
