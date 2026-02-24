"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { STATS } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || !header || !grid) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;

    if (prefersReduced) {
      gsap.set([header, ...Array.from(grid.children)], { opacity: 1, y: 0 });
      if (heading) gsap.set(heading.querySelectorAll(".scroll-word"), { y: 0, opacity: 1 });
      return;
    }

    if (isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: 1,
        },
      });

      tl.from(header, { opacity: 0, y: 20, duration: 1 });
      tl.from(grid.children, { opacity: 0, y: 20, scale: 0.9, stagger: 0.05, duration: 0.8 }, "-=0.5");

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    }

    // Desktop: pinned fullscreen
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=120vh",
        pin: true,
        anticipatePin: 1,
        scrub: 1,
      },
    });

    // 0-0.1: Label
    const label = header.querySelector(".stats-label");
    if (label) {
      tl.from(label, { opacity: 0, y: 20, duration: 0.1 }, 0);
    }

    // 0.05-0.35: Word-by-word heading
    if (heading) {
      const words = heading.querySelectorAll(".scroll-word");
      if (words.length) {
        words.forEach((word, i) => {
          tl.to(word, {
            y: 0,
            opacity: 1,
            duration: 0.04,
            ease: "power2.out",
          }, 0.05 + i * (0.3 / words.length));
        });
      }
    }

    // 0.4-0.85: Cards 3D flip-in
    tl.from(grid.children, {
      opacity: 0,
      rotateX: 45,
      scale: 0.7,
      y: 60,
      stagger: 0.08,
      duration: 0.2,
      ease: "back.out(1.2)",
    }, 0.4);

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="estadisticas"
      className="section-pinned perspective-section relative"
      style={{ zIndex: 4, backgroundColor: "var(--bg-stats)" }}
    >
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1200 400" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grid-g" x1="0%" y1="0%" x2="100%" y2="100%">
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
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div ref={headerRef} className="will-change-clip mb-12 text-center">
          <span className="stats-label mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            Resultados que Hablan
          </span>
          <h2 ref={headingRef} className="font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
            Numeros que respaldan cada palabra
          </h2>
        </div>
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1000px" }}
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
