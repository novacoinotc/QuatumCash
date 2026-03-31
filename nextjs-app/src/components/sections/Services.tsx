"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, DUR, STAGGER, MOVE, MOVE_MOBILE, SCRUB, GLOW } from "@/lib/animation";
import { SERVICES } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import ServiceCard from "@/components/ui/ServiceCard";
import ExchangeFlow from "@/components/visuals/ExchangeFlow";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const flow = flowRef.current;
    const grid = gridRef.current;
    const line = lineRef.current;
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

        /* ── Reduced motion: make everything visible immediately ── */
        if (reduceMotion) {
          gsap.set([header, ...cards], {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            rotation: 0,
            filter: "blur(0px)",
          });
          if (line) gsap.set(line, { scaleX: 1 });
          if (flow) {
            const flowEls = flow.querySelectorAll(
              ".flow-card-left, .flow-card-right, .flow-center"
            );
            gsap.set(flowEls, { autoAlpha: 1, x: 0, scale: 1, rotateY: 0, rotation: 0 });
          }
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          // Make icon wrappers visible
          const icons = grid.querySelectorAll(".service-icon-wrap");
          gsap.set(icons, { autoAlpha: 1, scale: 1 });
          return;
        }

        /* ── Mobile: separate ScrollTriggers, no 3D ── */
        if (isMobile) {
          // Header
          gsap.from(header, {
            autoAlpha: 0,
            y: MOVE_MOBILE.y.enter / 2,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              trigger: header,
              start: "top 90%",
            },
          });

          // ExchangeFlow
          if (flow) {
            gsap.from(flow, {
              autoAlpha: 0,
              y: MOVE_MOBILE.y.enter,
              duration: DUR.base,
              ease: EASE.enterSoft,
              scrollTrigger: {
                trigger: flow,
                start: "top 85%",
              },
            });
          }

          // Service cards grid
          gsap.from(cards, {
            autoAlpha: 0,
            y: MOVE_MOBILE.y.enter,
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

        /* ── Desktop: scroll-triggered, NOT pinned ── */
        if (isDesktop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "bottom 20%",
              scrub: SCRUB.cards,
            },
          });

          /* Beat 1: Section header */
          // Eyebrow
          const label = header.querySelector(".eyebrow");
          if (label) {
            tl.from(
              label,
              { autoAlpha: 0, y: -20, duration: 0.08, ease: EASE.enter },
              0
            );
          }

          // Heading word-by-word
          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            if (words.length) {
              words.forEach((word, i) => {
                const pos = 0.02 + i * (0.12 / words.length);
                tl.to(
                  word,
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.03,
                    ease: EASE.enter,
                  },
                  pos
                );
              });
            }
          }

          // Subtitle
          const subtitle = header.querySelector(".services-subtitle");
          if (subtitle) {
            tl.from(
              subtitle,
              { autoAlpha: 0, y: 20, filter: "blur(3px)", duration: 0.08, ease: EASE.enterSoft },
              0.12
            );
          }

          // Decorative line: scaleX 0 -> 1
          if (line) {
            tl.fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: DUR.slow / 4, ease: EASE.enter, transformOrigin: "left center" },
              0.12
            );
          }

          /* Beat 2: ExchangeFlow */
          if (flow) {
            const mxnCard = flow.querySelector(".flow-card-left");
            const cryptoCard = flow.querySelector(".flow-card-right");
            const hexCenter = flow.querySelector(".flow-center");
            if (mxnCard && cryptoCard && hexCenter) {
              tl.from(
                mxnCard,
                {
                  autoAlpha: 0,
                  x: -MOVE.x.enter,
                  rotateY: 20,
                  scale: 0.8,
                  duration: 0.12,
                  ease: EASE.enter,
                },
                0.2
              );
              tl.from(
                hexCenter,
                {
                  autoAlpha: 0,
                  scale: 0,
                  rotation: -120,
                  duration: 0.12,
                  ease: EASE.elastic,
                },
                0.27
              );
              tl.from(
                cryptoCard,
                {
                  autoAlpha: 0,
                  x: MOVE.x.enter,
                  rotateY: -20,
                  scale: 0.8,
                  duration: 0.12,
                  ease: EASE.enter,
                },
                0.27
              );
            }
          }

          /* Beat 3: Service cards cascade */
          tl.from(
            cards,
            {
              autoAlpha: 0,
              y: MOVE.y.enter,
              rotateY: -8,
              stagger: { amount: 0.5, from: "start" },
              duration: DUR.base / 4,
              ease: EASE.enterSoft,
            },
            0.4
          );

          // After each card lands, icon pops
          const icons = grid.querySelectorAll(".service-icon-wrap");
          if (icons.length) {
            cards.forEach((_, i) => {
              const cardLandTime = 0.4 + (0.5 / cards.length) * i + DUR.base / 4;
              if (icons[i]) {
                tl.from(
                  icons[i],
                  {
                    scale: 0.5,
                    autoAlpha: 0,
                    duration: DUR.fast / 4,
                    ease: EASE.spring,
                  },
                  cardLandTime + 0.15 / 4 // 0.15 delay scaled
                );
              }
            });
          }

          /* Beat 4: Border illumination sweep */
          const allCardsLandTime = 0.4 + 0.5 + DUR.base / 4 + 0.05;
          cards.forEach((card, i) => {
            const sweepStart = allCardsLandTime + i * 0.1 / 4;
            tl.to(
              card,
              {
                borderColor: GLOW.primary,
                duration: DUR.fast / 4,
                ease: EASE.enter,
              },
              sweepStart
            );
            tl.to(
              card,
              {
                borderColor: "rgba(0,240,255,0.15)",
                duration: DUR.fast / 4,
                ease: EASE.enterSoft,
              },
              sweepStart + DUR.fast / 4
            );
          });

          /* Magnetic tilt on service cards (desktop only) */
          const magneticCards = grid.querySelectorAll<HTMLElement>(".magnetic-card");
          const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

          magneticCards.forEach((card) => {
            const handleMove = (e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              const rotateY = (x - 0.5) * 16; // max +/-8deg
              const rotateX = (0.5 - y) * 16;
              card.style.setProperty("--mouse-x", `${x * 100}%`);
              card.style.setProperty("--mouse-y", `${y * 100}%`);
              gsap.to(card, { rotateY, rotateX, duration: DUR.fast, ease: EASE.hoverIn, overwrite: true });
            };
            const handleLeave = () => {
              gsap.to(card, { rotateX: 0, rotateY: 0, duration: DUR.fast, ease: EASE.hoverOut, overwrite: true });
            };
            card.addEventListener("mousemove", handleMove);
            card.addEventListener("mouseleave", handleLeave);
            handlers.push({ el: card, move: handleMove, leave: handleLeave });
          });

          // Cleanup magnetic listeners
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
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-50 max-md:hidden" viewBox="0 0 1200 800" fill="none">
          <line x1="100" y1="200" x2="300" y2="100" stroke="#7C3AED" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="300" y1="100" x2="500" y2="250" stroke="#A78BFA" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="150" x2="900" y2="300" stroke="#F472B6" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.12;0.05" dur="4s" repeatCount="indefinite" />
          </line>
          <g opacity="0.25"><circle cx="100" cy="200" r="4" fill="#7C3AED" /><circle cx="100" cy="200" r="8" stroke="#7C3AED" strokeWidth="0.5" fill="none" opacity="0.3" /></g>
          <g opacity="0.2"><circle cx="300" cy="100" r="3" fill="#A78BFA" /></g>
          <g opacity="0.2"><circle cx="500" cy="250" r="3.5" fill="#F472B6" /></g>
          <circle r="2" fill="#F472B6" opacity="0.5">
            <animateMotion dur="8s" repeatCount="indefinite" path="M100,200 L300,100 L500,250 L700,150 L900,300 L1100,200" />
          </circle>
        </svg>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
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
          <div
            ref={lineRef}
            className="mx-auto mt-6 h-px w-24"
            style={{
              background: `linear-gradient(90deg, transparent, ${GLOW.secondary}, transparent)`,
              transformOrigin: "left center",
            }}
          />
        </div>

        <div ref={flowRef} style={{ perspective: "1200px" }}>
          <ExchangeFlow />
        </div>

        <div
          ref={gridRef}
          className="perspective-cards grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "800px" }}
        >
          {SERVICES.map((service) => (
            <div key={service.title} className="glass-card magnetic-card">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                desc={service.desc}
                tags={service.tags}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
