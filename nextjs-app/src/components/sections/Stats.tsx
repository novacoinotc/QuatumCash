"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, DUR, STAGGER, MOVE, MOVE_MOBILE, SCRUB, GLOW } from "@/lib/animation";
import { STATS } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import StatCard from "@/components/ui/StatCard";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridBgRef = useRef<SVGSVGElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    const gridBg = gridBgRef.current;
    const heading = headingRef.current;
    if (!section || !header || !grid) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;

        const cards = Array.from(grid.children) as HTMLElement[];
        const label = header.querySelector(".eyebrow");

        // Reduced motion: make everything visible, no animation
        if (reduceMotion) {
          gsap.set(header, { autoAlpha: 1, y: 0 });
          gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0 });
          if (label) gsap.set(label, { autoAlpha: 1, y: 0 });
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          return;
        }

        /* ── Mobile: no pin, cards scroll-reveal individually ── */
        if (isMobile) {
          // Header
          gsap.from(header, {
            autoAlpha: 0,
            y: MOVE_MOBILE.y.enter / 2,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
            },
          });

          // Cards stagger
          gsap.from(cards, {
            autoAlpha: 0,
            y: MOVE_MOBILE.y.enter,
            scale: 0.95,
            stagger: STAGGER.small,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              trigger: grid,
              start: "top 85%",
            },
          });

          return;
        }

        /* ── Desktop: pinned cinematic scrub ── */
        if (isDesktop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=100%",
              pin: true,
              anticipatePin: 1,
              scrub: SCRUB.cinematic,
            },
          });

          /* Phase 1 (0%-20%): Section entrance */
          // Grid background fades in
          if (gridBg) {
            tl.fromTo(
              gridBg,
              { autoAlpha: 0 },
              { autoAlpha: 0.5, duration: 0.2 },
              0
            );
          }

          // Eyebrow label
          if (label) {
            tl.from(
              label,
              { autoAlpha: 0, y: -20, duration: 0.1, ease: EASE.enter },
              0
            );
          }

          // Heading word-by-word with perspective rotation
          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            if (words.length) {
              words.forEach((word, i) => {
                const pos = 0.02 + i * (0.18 / words.length);
                tl.to(
                  word,
                  {
                    y: 0,
                    autoAlpha: 1,
                    rotateX: 0,
                    duration: 0.04,
                    ease: EASE.enter,
                  },
                  pos
                );
              });
              // Set initial rotateX state via GSAP (the hook sets y + opacity)
              gsap.set(words, { rotateX: -40 });
            }
          }

          /* Phase 2 (20%-40%): Stat cards fly in */
          tl.from(
            cards,
            {
              autoAlpha: 0,
              y: 120,
              scale: 0.85,
              stagger: STAGGER.medium,
              duration: DUR.slow / 4, // relative to timeline
              ease: EASE.enter,
            },
            0.2
          );

          // Border flash on landing
          cards.forEach((card, i) => {
            const landTime = 0.2 + i * STAGGER.medium + DUR.slow / 4;
            tl.fromTo(
              card,
              { borderColor: "transparent" },
              {
                borderColor: GLOW.primary,
                duration: DUR.fast / 4,
                ease: EASE.enter,
              },
              landTime
            );
            tl.to(
              card,
              {
                borderColor: "rgba(0,240,255,0.15)",
                duration: DUR.fast / 4,
                ease: EASE.enterSoft,
              },
              landTime + DUR.fast / 4
            );
          });

          /* Phase 3 (40%-75%): Number counter glow */
          const numberEls = grid.querySelectorAll(".stat-number");
          if (numberEls.length) {
            // Glow intensifies
            tl.to(
              numberEls,
              {
                textShadow: `0 0 20px ${GLOW.primary}`,
                duration: 0.2,
                stagger: STAGGER.small,
                ease: EASE.enterSoft,
              },
              0.4
            );
            // Glow settles
            tl.to(
              numberEls,
              {
                textShadow: "0 0 8px rgba(0,240,255,0.2)",
                duration: 0.15,
                stagger: STAGGER.small,
                ease: EASE.enterSoft,
              },
              0.6
            );
          }

          /* Phase 4 (75%-100%): Settle */
          // Cards drift up (parallax feel)
          tl.to(
            cards,
            {
              y: -20,
              duration: 0.25,
              stagger: STAGGER.small,
              ease: EASE.enterSoft,
            },
            0.75
          );

          // Grid background fades out
          if (gridBg) {
            tl.to(
              gridBg,
              { autoAlpha: 0, duration: 0.25 },
              0.75
            );
          }
        }
      }
    );

    return () => mm.revert();
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
        <svg
          ref={gridBgRef}
          className="absolute inset-0 h-full w-full opacity-50"
          viewBox="0 0 1200 400"
          fill="none"
          preserveAspectRatio="none"
        >
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
          <span className="eyebrow mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            <span className="eyebrow-line">Resultados que Hablan</span>
          </span>
          <h2
            ref={headingRef}
            className="font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white"
            style={{ perspective: "800px" }}
          >
            Numeros que respaldan cada palabra
          </h2>
        </div>
        <div
          ref={gridRef}
          className="perspective-cards grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1000px" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card">
              <StatCard
                target={stat.target}
                suffix={stat.suffix}
                decimal={stat.decimal}
                label={stat.label}
                detail={stat.detail}
                scrub
              />
            </div>
          ))}
        </div>
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
