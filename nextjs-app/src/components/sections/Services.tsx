"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import { SERVICES } from "@/lib/constants";

/* ── Inline SVG Icons ── */
const ICONS: Record<string, ReactNode> = {
  exchange: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
  dollar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  shield: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  card: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  code: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  ),
};

/* Indices of cards that get the bento-lg treatment */
const BENTO_LG_INDICES = new Set([0, 4]);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || !header || !grid) return;

    /* ── Split heading into words for reveal ── */
    if (heading && typeof window !== "undefined" && window.innerWidth > 768) {
      const text = heading.textContent || "";
      heading.innerHTML = text
        .split(" ")
        .map((w) => `<span class="scroll-word inline-block" style="opacity:0;transform:translateY(40px)">${w}&nbsp;</span>`)
        .join("");
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;
        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

        /* ── Reduced motion ── */
        if (reduceMotion) {
          gsap.set([header, ...cards], {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            filter: "blur(0px)",
          });
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          return;
        }

        /* ── Mobile: simple stagger reveal ── */
        if (isMobile) {
          gsap.from(header, {
            autoAlpha: 0,
            y: 30,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              trigger: header,
              start: "top 90%",
            },
          });

          gsap.from(cards, {
            autoAlpha: 0,
            y: 60,
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

        /* ── Desktop: scrub timeline ── */
        if (isDesktop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 20%",
              scrub: 1.2,
            },
          });

          /* Beat 1 — Eyebrow */
          const eyebrow = header.querySelector(".eyebrow");
          if (eyebrow) {
            tl.from(eyebrow, {
              autoAlpha: 0,
              y: -20,
              duration: 0.08,
              ease: EASE.enter,
            }, 0);
          }

          /* Beat 1 — Heading word-by-word */
          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            words.forEach((word, i) => {
              const pos = 0.02 + i * (0.12 / Math.max(words.length, 1));
              tl.to(word, {
                y: 0,
                autoAlpha: 1,
                duration: 0.03,
                ease: EASE.enter,
              }, pos);
            });
          }

          /* Beat 1 — Subtitle */
          const subtitle = header.querySelector(".services-subtitle");
          if (subtitle) {
            tl.from(subtitle, {
              autoAlpha: 0,
              y: 20,
              filter: "blur(3px)",
              duration: 0.08,
              ease: EASE.enterSoft,
            }, 0.12);
          }

          /* Beat 2 — Cards cascade stagger */
          tl.from(cards, {
            autoAlpha: 0,
            y: 80,
            scale: 0.95,
            stagger: { amount: 0.6, from: "start" },
            duration: DUR.base / 4,
            ease: EASE.enterSoft,
          }, 0.2);

          /* Beat 3 — Border illumination sweep */
          const allCardsLand = 0.2 + 0.6 + DUR.base / 4;
          cards.forEach((card, i) => {
            const sweepStart = allCardsLand + i * 0.1 / 4;
            tl.to(card, {
              borderColor: "rgba(0,240,255,0.6)",
              duration: DUR.fast / 4,
              ease: EASE.enter,
            }, sweepStart);
            tl.to(card, {
              borderColor: "rgba(0,240,255,0.15)",
              duration: DUR.fast / 4,
              ease: EASE.enterSoft,
            }, sweepStart + DUR.fast / 4);
          });

          /* Magnetic tilt on cards */
          const handlers: Array<{
            el: HTMLDivElement;
            move: (e: MouseEvent) => void;
            leave: () => void;
          }> = [];

          cards.forEach((card) => {
            const handleMove = (e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              const rotateY = (x - 0.5) * 16; // max +/-8deg
              const rotateX = (0.5 - y) * 16;
              card.style.setProperty("--mx", `${x * 100}%`);
              card.style.setProperty("--my", `${y * 100}%`);
              gsap.to(card, {
                rotateY,
                rotateX,
                duration: DUR.fast,
                ease: EASE.enterSoft,
                overwrite: true,
              });
            };
            const handleLeave = () => {
              gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: DUR.fast,
                ease: EASE.enterSoft,
                overwrite: true,
              });
            };
            card.addEventListener("mousemove", handleMove);
            card.addEventListener("mouseleave", handleLeave);
            handlers.push({ el: card, move: handleMove, leave: handleLeave });
          });

          return () => {
            handlers.forEach(({ el, move, leave }) => {
              el.removeEventListener("mousemove", move);
              el.removeEventListener("mouseleave", leave);
            });
          };
        }
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="perspective-section relative"
      style={{ zIndex: 3, backgroundColor: "var(--bg-services)" }}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        {/* Header */}
        <div ref={headerRef} className="mb-12 text-center">
          <span className="eyebrow mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            <span className="eyebrow-line">Servicios</span>
          </span>
          <h2
            ref={headingRef}
            className="mb-4 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white"
            style={{ perspective: "800px" }}
          >
            Todo lo que necesitas, en un solo lugar
          </h2>
          <p className="services-subtitle mx-auto max-w-xl text-[var(--gray-400)]">
            Desde la compra-venta de criptomonedas hasta analisis forense de
            wallets. Soluciones integrales respaldadas por la tecnologia de
            NovaCoin.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="bento"
          style={{ perspective: "800px" }}
        >
          {SERVICES.map((service, i) => {
            const isLarge = BENTO_LG_INDICES.has(i);
            return (
              <div
                key={service.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`glass-card magnetic-card relative overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm transition-colors${
                  isLarge ? " bento-lg" : ""
                }`}
                style={{
                  padding: isLarge ? "2.5rem" : "1.5rem",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Spotlight pseudo — driven by --mx / --my */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(0,240,255,0.06), transparent 60%)",
                  }}
                />

                {/* Icon */}
                <div
                  className={`mb-4 inline-flex items-center justify-center rounded-xl border border-[rgba(0,240,255,0.15)] bg-[rgba(0,240,255,0.05)] text-[var(--cyan)]${
                    isLarge ? " h-14 w-14" : " h-11 w-11"
                  }`}
                >
                  {ICONS[service.icon] ?? null}
                </div>

                {/* Title */}
                <h3
                  className={`mb-2 font-[var(--font-primary)] font-semibold text-white${
                    isLarge ? " text-xl" : " text-base"
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`mb-4 leading-relaxed text-[var(--gray-400)]${
                    isLarge ? " text-sm" : " text-[13px]"
                  }`}
                >
                  {service.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full border border-[rgba(0,240,255,0.12)] bg-[rgba(0,240,255,0.04)] px-3 py-1 text-[11px] font-medium text-[var(--cyan)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
