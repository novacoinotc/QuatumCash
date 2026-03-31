"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, DUR, STAGGER, MOVE, MOVE_MOBILE, BLUR, SCRUB, GLOW } from "@/lib/animation";
import { WHY_ITEMS } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const threadRef = useRef<SVGSVGElement>(null);
  const threadLineRef = useRef<SVGLineElement>(null);
  const reasonsContainerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const headingBlockRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const heading = headingRef.current;
    const container = reasonsContainerRef.current;
    if (!section || !header || !container) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;

        const eyebrow = eyebrowRef.current;
        const eyebrowLine = eyebrowLineRef.current;
        const blocks = blockRefs.current.filter(Boolean) as HTMLDivElement[];
        const markers = markerRefs.current.filter(Boolean) as HTMLDivElement[];
        const ghosts = ghostRefs.current.filter(Boolean) as HTMLSpanElement[];
        const headings = headingBlockRefs.current.filter(Boolean) as HTMLHeadingElement[];
        const bodies = bodyRefs.current.filter(Boolean) as HTMLParagraphElement[];

        /* ── Reduced motion: make everything visible ── */
        if (reduceMotion) {
          gsap.set([header, ...blocks], {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          });
          gsap.set(markers, { autoAlpha: 1, scale: 1 });
          gsap.set(ghosts, { autoAlpha: 0.08, scale: 1, filter: "blur(0px)" });
          gsap.set(headings, { autoAlpha: 1, x: 0, filter: "blur(0px)" });
          gsap.set(bodies, { autoAlpha: 1, y: 0 });
          if (eyebrow) gsap.set(eyebrow, { autoAlpha: 1, x: 0, filter: "blur(0px)" });
          if (eyebrowLine) gsap.set(eyebrowLine, { scaleX: 1 });
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          if (threadLineRef.current) {
            gsap.set(threadLineRef.current, { strokeDashoffset: 0 });
          }
          return;
        }

        /* ── Mobile: simple per-block entrance ── */
        if (isMobile) {
          // Header
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              end: "bottom 60%",
              scrub: SCRUB.text,
            },
          });

          if (eyebrow) {
            headerTl.from(eyebrow, {
              autoAlpha: 0,
              x: -20,
              filter: "blur(4px)",
              duration: 0.3,
              ease: EASE.enterSoft,
            }, 0);
          }
          if (eyebrowLine) {
            headerTl.from(eyebrowLine, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.3,
              ease: EASE.enter,
            }, 0);
          }

          headerTl.from(header.querySelector("h2") || header, {
            autoAlpha: 0,
            y: 20,
            duration: 0.5,
          }, 0.2);

          // Each block: simple y entrance
          blocks.forEach((block, i) => {
            gsap.timeline({
              scrollTrigger: {
                trigger: block,
                start: "top 85%",
                end: "bottom 60%",
                scrub: SCRUB.text,
              },
            }).from(block, {
              autoAlpha: 0,
              y: MOVE_MOBILE.y.enter,
              duration: DUR.base,
              ease: EASE.enterSoft,
            });

            // Markers still animate on mobile
            if (markers[i]) {
              gsap.timeline({
                scrollTrigger: {
                  trigger: block,
                  start: "top 80%",
                  end: "top 50%",
                  scrub: SCRUB.text,
                },
              }).from(markers[i], {
                scale: 0.5,
                autoAlpha: 0,
                duration: 0.4,
                ease: EASE.elastic,
              });
            }
          });

          return;
        }

        /* ── Desktop: per-block ScrollTriggers with progress thread ── */
        if (isDesktop) {
          // ── Header animation ──
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 80%",
              end: "bottom 50%",
              scrub: SCRUB.text,
            },
          });

          if (eyebrow) {
            headerTl.from(eyebrow, {
              autoAlpha: 0,
              x: -30,
              filter: "blur(4px)",
              duration: 0.08,
              ease: EASE.enterSoft,
            }, 0);
          }
          if (eyebrowLine) {
            headerTl.from(eyebrowLine, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.08,
              ease: EASE.enter,
            }, 0);
          }

          // Word-by-word heading
          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            if (words.length) {
              const totalDuration = 0.3;
              const perWord = totalDuration / words.length;
              words.forEach((word, i) => {
                headerTl.fromTo(
                  word,
                  { autoAlpha: 0, y: 60, rotateX: -40 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    rotateX: 0,
                    duration: DUR.slow / 10,
                    ease: EASE.enter,
                  },
                  0.05 + i * perWord
                );
              });
            }
          }

          // ── Progress thread ──
          const threadLine = threadLineRef.current;
          if (threadLine && container) {
            const totalHeight = container.scrollHeight;
            gsap.set(threadLine, {
              strokeDasharray: totalHeight,
              strokeDashoffset: totalHeight,
            });

            gsap.to(threadLine, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top 70%",
                end: "bottom 30%",
                scrub: SCRUB.text,
              },
            });
          }

          // ── Per-block animations ──
          blocks.forEach((block, i) => {
            const blockTl = gsap.timeline({
              scrollTrigger: {
                trigger: block,
                start: "top 70%",
                end: "bottom 30%",
                scrub: SCRUB.text,
              },
            });

            // 1. Marker: scale up and fill with glow
            if (markers[i]) {
              blockTl.fromTo(
                markers[i],
                {
                  scale: 0.5,
                  autoAlpha: 0.3,
                  borderColor: "rgba(0,240,255,0.2)",
                  boxShadow: `0 0 0px ${GLOW.primary}`,
                },
                {
                  scale: 1,
                  autoAlpha: 1,
                  borderColor: GLOW.primary,
                  boxShadow: `0 0 20px ${GLOW.primary}40, 0 0 6px ${GLOW.primary}20`,
                  duration: DUR.base,
                  ease: EASE.enter,
                },
                0
              );
            }

            // 2. Ghost number
            if (ghosts[i]) {
              blockTl.fromTo(
                ghosts[i],
                {
                  autoAlpha: 0,
                  scale: 2,
                  filter: BLUR.enter,
                },
                {
                  autoAlpha: 0.08,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: DUR.slow,
                  ease: EASE.enter,
                },
                0
              );
            }

            // 3. Heading from alternating side
            if (headings[i]) {
              const xFrom = i % 2 === 0 ? -80 : 80;
              blockTl.fromTo(
                headings[i],
                {
                  autoAlpha: 0,
                  x: xFrom,
                  filter: "blur(8px)",
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  filter: "blur(0px)",
                  duration: DUR.base,
                  ease: EASE.enter,
                },
                0.1
              );
            }

            // 4. Body text
            if (bodies[i]) {
              blockTl.fromTo(
                bodies[i],
                {
                  autoAlpha: 0,
                  y: 40,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: DUR.base,
                  ease: EASE.enterSoft,
                },
                "-=0.5"
              );
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
      id="por-que-elegirme"
      className="relative py-[var(--section-padding)]"
      style={{ zIndex: 2, backgroundColor: "var(--bg-why)" }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-[var(--container-max)] px-6 mb-16">
        <div ref={headerRef}>
          <span
            className="eyebrow mb-4 inline-flex items-center gap-3 font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]"
            ref={eyebrowRef}
          >
            <span
              className="eyebrow-line inline-block h-px w-8 bg-[var(--purple-light)]"
              ref={eyebrowLineRef}
            />
            Por que Elegirme
          </span>
          <h2
            ref={headingRef}
            className="font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white max-w-xl"
            style={{ perspective: "800px" }}
          >
            La diferencia esta en los detalles
          </h2>
        </div>
      </div>

      {/* Reason blocks with progress thread */}
      <div className="relative mx-auto max-w-[var(--container-max)] px-6" ref={reasonsContainerRef}>
        {/* Progress thread SVG — desktop only */}
        <svg
          ref={threadRef}
          className="progress-thread absolute top-0 h-full w-[2px] max-md:hidden"
          style={{ left: "24px" }}
          aria-hidden="true"
        >
          <line
            ref={threadLineRef}
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            className="progress-thread-line"
            stroke={GLOW.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Reason blocks */}
        <div className="flex flex-col gap-0">
          {WHY_ITEMS.map((item, i) => (
            <div
              key={item.number}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              className="reason-block relative grid gap-8 py-12 lg:grid-cols-[60px_1fr] lg:gap-16 border-b border-[var(--border-default)] last:border-b-0"
            >
              {/* Number marker (left) */}
              <div className="relative flex justify-center">
                <div
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-glow)] text-[var(--glow-primary)] font-[var(--font-primary)] font-bold text-sm"
                >
                  {item.number}
                </div>
              </div>

              {/* Content (right) */}
              <div className="relative">
                {/* Ghost number — desktop only */}
                <span
                  ref={(el) => {
                    ghostRefs.current[i] = el;
                  }}
                  className="ghost-number pointer-events-none absolute select-none font-[var(--font-primary)] text-[8rem] font-black leading-none text-white max-md:hidden"
                  style={{
                    top: "-10px",
                    [i % 2 === 0 ? "right" : "left"]: "-20px",
                    opacity: 0,
                  }}
                  aria-hidden="true"
                >
                  {item.number}
                </span>
                <h4
                  ref={(el) => {
                    headingBlockRefs.current[i] = el;
                  }}
                  className="mb-2 font-[var(--font-primary)] text-xl font-semibold text-white"
                >
                  {item.title}
                </h4>
                <p
                  ref={(el) => {
                    bodyRefs.current[i] = el;
                  }}
                  className="text-[var(--text-secondary)] leading-relaxed max-w-lg"
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
