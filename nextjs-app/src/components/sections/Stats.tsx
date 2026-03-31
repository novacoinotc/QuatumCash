"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import { STATS } from "@/lib/constants";

/* ── Pick 4 high-impact stats: indices 0, 2, 3, 5 ── */
const SELECTED_INDICES = [0, 2, 3, 5] as const;
const SELECTED_STATS = SELECTED_INDICES.map((i) => STATS[i]);
const SLIDE_COUNT = SELECTED_STATS.length;

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const suffixRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const setSlideRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[i] = el;
    },
    []
  );
  const setNumberRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      numberRefs.current[i] = el;
    },
    []
  );
  const setLabelRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      labelRefs.current[i] = el;
    },
    []
  );
  const setDetailRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      detailRefs.current[i] = el;
    },
    []
  );
  const setSuffixRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      suffixRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const dotsContainer = dotsRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;

        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const numbers = numberRefs.current.filter(Boolean) as HTMLDivElement[];
        const labels = labelRefs.current.filter(Boolean) as HTMLDivElement[];
        const details = detailRefs.current.filter(Boolean) as HTMLDivElement[];
        const suffixes = suffixRefs.current.filter(Boolean) as HTMLSpanElement[];
        const dots = dotsContainer
          ? (Array.from(dotsContainer.children) as HTMLDivElement[])
          : [];

        /* ── Reduced motion ── */
        if (reduceMotion) {
          slides.forEach((slide, i) => {
            gsap.set(slide, { autoAlpha: 1 });
            const stat = SELECTED_STATS[i];
            const numEl = numbers[i];
            if (numEl) {
              const formatted = stat.decimal
                ? stat.target.toFixed(1)
                : Math.round(stat.target).toLocaleString("en-US");
              numEl.textContent = formatted;
            }
            if (suffixes[i]) gsap.set(suffixes[i], { autoAlpha: 1, scale: 1 });
            if (labels[i]) gsap.set(labels[i], { autoAlpha: 1, y: 0 });
            if (details[i]) gsap.set(details[i], { autoAlpha: 1, y: 0 });
          });
          if (header) gsap.set(header, { autoAlpha: 1 });
          return;
        }

        /* ── MOBILE: 2-col grid, each card scroll-reveals independently ── */
        if (isMobile) {
          // Hide desktop-only dots
          if (dotsContainer) gsap.set(dotsContainer, { display: "none" });

          // Make all slides visible (they use grid layout on mobile via CSS)
          slides.forEach((slide) => gsap.set(slide, { position: "relative", autoAlpha: 1 }));

          // Header reveal
          if (header) {
            gsap.from(header, {
              autoAlpha: 0,
              y: 20,
              duration: DUR.base,
              ease: EASE.enterSoft,
              scrollTrigger: { trigger: header, start: "top 85%" },
            });
          }

          // Each card: counter + reveal
          slides.forEach((slide, i) => {
            const stat = SELECTED_STATS[i];
            const numEl = numbers[i];
            const labelEl = labels[i];
            const detailEl = details[i];
            const suffixEl = suffixes[i];

            // Card entrance
            gsap.from(slide, {
              autoAlpha: 0,
              y: 40,
              scale: 0.95,
              duration: DUR.base,
              ease: EASE.enterSoft,
              scrollTrigger: { trigger: slide, start: "top 80%" },
            });

            // Number counter
            if (numEl) {
              const proxy = { value: 0 };
              gsap.to(proxy, {
                value: stat.target,
                duration: DUR.slow,
                snap: { snapTo: stat.decimal ? 0.1 : 1 },
                ease: EASE.enterSoft,
                scrollTrigger: { trigger: slide, start: "top 80%" },
                onUpdate: () => {
                  const formatted = stat.decimal
                    ? proxy.value.toFixed(1)
                    : Math.round(proxy.value).toLocaleString("en-US");
                  numEl.textContent = formatted;
                },
                onComplete: () => {
                  if (suffixEl) {
                    gsap.fromTo(
                      suffixEl,
                      { autoAlpha: 0, scale: 0.5 },
                      { autoAlpha: 1, scale: 1, duration: DUR.fast, ease: EASE.spring }
                    );
                  }
                },
              });
            }

            // Label + detail
            if (labelEl) {
              gsap.from(labelEl, {
                autoAlpha: 0,
                y: 15,
                duration: DUR.base,
                delay: 0.2,
                ease: EASE.enterSoft,
                scrollTrigger: { trigger: slide, start: "top 80%" },
              });
            }
            if (detailEl) {
              gsap.from(detailEl, {
                autoAlpha: 0,
                y: 15,
                duration: DUR.base,
                delay: 0.35,
                ease: EASE.enterSoft,
                scrollTrigger: { trigger: slide, start: "top 80%" },
              });
            }
          });

          return;
        }

        /* ── DESKTOP: Pinned full-viewport crossfade slides ── */
        if (isDesktop) {
          // Initial state: all slides hidden except managed by timeline
          slides.forEach((slide) => {
            gsap.set(slide, { autoAlpha: 0 });
          });
          labels.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 20 }));
          details.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 20 }));
          suffixes.forEach((el) => gsap.set(el, { autoAlpha: 0, scale: 0.5 }));

          // Header starts visible
          if (header) gsap.set(header, { autoAlpha: 1 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${SLIDE_COUNT * 100}vh`,
              pin: true,
              anticipatePin: 1,
              scrub: 1,
            },
          });

          const sliceDur = 1 / SLIDE_COUNT; // 0.25 per slide

          SELECTED_STATS.forEach((stat, i) => {
            const slideEl = slides[i];
            const numEl = numbers[i];
            const labelEl = labels[i];
            const detailEl = details[i];
            const suffixEl = suffixes[i];
            const dot = dots[i];

            const slideStart = i * sliceDur;
            const enterEnd = slideStart + sliceDur * 0.15;
            const holdEnd = slideStart + sliceDur * 0.8;
            const slideEnd = slideStart + sliceDur;

            // ── Fade in slide container ──
            tl.fromTo(
              slideEl,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: sliceDur * 0.1, ease: "none" },
              slideStart
            );

            // ── Number counter via proxy ──
            if (numEl) {
              const proxy = { value: 0 };
              tl.to(
                proxy,
                {
                  value: stat.target,
                  duration: sliceDur * 0.5,
                  snap: { snapTo: stat.decimal ? 0.1 : 1 },
                  ease: EASE.enterSoft,
                  onUpdate: () => {
                    const formatted = stat.decimal
                      ? proxy.value.toFixed(1)
                      : Math.round(proxy.value).toLocaleString("en-US");
                    numEl.textContent = formatted;
                  },
                },
                slideStart + sliceDur * 0.05
              );

              // Cyan glow peaks during count, then settles
              tl.fromTo(
                numEl,
                { textShadow: "0 0 0px rgba(0,240,255,0)" },
                {
                  textShadow: "0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(0,240,255,0.3)",
                  duration: sliceDur * 0.35,
                  ease: EASE.enterSoft,
                },
                slideStart + sliceDur * 0.05
              );
              tl.to(
                numEl,
                {
                  textShadow: "0 0 15px rgba(0,240,255,0.2), 0 0 0px rgba(0,240,255,0)",
                  duration: sliceDur * 0.2,
                  ease: EASE.enterSoft,
                },
                slideStart + sliceDur * 0.45
              );
            }

            // ── Suffix pops ──
            if (suffixEl) {
              tl.to(
                suffixEl,
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: sliceDur * 0.1,
                  ease: EASE.spring,
                },
                slideStart + sliceDur * 0.5
              );
            }

            // ── Label fade in ──
            if (labelEl) {
              tl.to(
                labelEl,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: sliceDur * 0.12,
                  ease: EASE.enterSoft,
                },
                enterEnd
              );
            }

            // ── Detail fade in ──
            if (detailEl) {
              tl.to(
                detailEl,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: sliceDur * 0.12,
                  ease: EASE.enterSoft,
                },
                enterEnd + sliceDur * 0.05
              );
            }

            // ── Active dot ──
            if (dot) {
              tl.to(
                dot,
                {
                  backgroundColor: "var(--cyan)",
                  scale: 1.5,
                  duration: sliceDur * 0.05,
                  ease: "none",
                },
                slideStart
              );
              // Deactivate dot at slide exit
              if (i < SLIDE_COUNT - 1) {
                tl.to(
                  dot,
                  {
                    backgroundColor: "transparent",
                    scale: 1,
                    duration: sliceDur * 0.05,
                    ease: "none",
                  },
                  holdEnd
                );
              }
            }

            // ── Exit: fade out in the last 20% of the slide range ──
            if (i < SLIDE_COUNT - 1) {
              tl.to(
                slideEl,
                {
                  autoAlpha: 0,
                  y: -30,
                  duration: sliceDur * 0.2,
                  ease: EASE.exit,
                },
                holdEnd
              );
              // Reset y for potential re-entry (not needed but clean)
              tl.set(slideEl, { y: 0 }, slideEnd);

              // Reset label/detail/suffix for next cycle
              if (labelEl) tl.set(labelEl, { autoAlpha: 0, y: 20 }, slideEnd);
              if (detailEl) tl.set(detailEl, { autoAlpha: 0, y: 20 }, slideEnd);
              if (suffixEl) tl.set(suffixEl, { autoAlpha: 0, scale: 0.5 }, slideEnd);
            }
          });
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="estadisticas"
      className="relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Section header */}
      <div
        ref={headerRef}
        className="absolute left-0 right-0 top-8 z-10 text-center"
      >
        <div className="eyebrow justify-center">
          <span className="eyebrow-line" />
          Resultados
          <span className="eyebrow-line" style={{ transformOrigin: "right" }} />
        </div>
      </div>

      {/* Stat slides */}
      <div className="relative min-h-screen max-md:grid max-md:grid-cols-2 max-md:gap-4 max-md:px-6 max-md:py-24">
        {SELECTED_STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={setSlideRef(i)}
            className="
              md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center
              max-md:glass-card max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:rounded-2xl max-md:p-6
            "
            style={{ willChange: "opacity, transform" }}
          >
            {/* Number */}
            <div className="flex items-baseline justify-center">
              <div
                ref={setNumberRef(i)}
                className="
                  stat-number-giant
                  font-[var(--font-primary)] font-bold leading-none text-white
                  text-[clamp(3rem,15vw,12rem)]
                  max-md:text-[clamp(2rem,10vw,3.5rem)]
                "
              >
                0
              </div>
              <span
                ref={setSuffixRef(i)}
                className="
                  ml-2 font-[var(--font-primary)] font-bold text-[var(--cyan)]
                  text-[clamp(1.5rem,5vw,4rem)]
                  max-md:text-[clamp(1rem,3vw,1.5rem)]
                "
                style={{ opacity: 0 }}
              >
                {stat.suffix}
              </span>
            </div>

            {/* Label */}
            <div
              ref={setLabelRef(i)}
              className="
                stat-label mt-4 font-[var(--font-primary)] font-semibold uppercase tracking-[3px] text-[var(--cyan)]
                text-[clamp(0.875rem,1.5vw,1.25rem)]
                max-md:mt-2 max-md:text-xs max-md:tracking-[2px]
              "
            >
              {stat.label}
            </div>

            {/* Detail */}
            <div
              ref={setDetailRef(i)}
              className="
                stat-detail mt-3 max-w-md text-center text-[var(--text-muted)]
                text-[clamp(0.875rem,1.2vw,1.1rem)]
                max-md:mt-1 max-md:text-xs
              "
            >
              {stat.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots (desktop only) */}
      <div
        ref={dotsRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3 max-md:hidden"
      >
        {SELECTED_STATS.map((_, i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full border border-[var(--cyan)]/30 transition-all duration-300"
          />
        ))}
      </div>
    </section>
  );
}
