"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import { WHY_ITEMS } from "@/lib/constants";

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInnerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const heading = headingRef.current;
    const container = containerRef.current;
    const lineInner = lineInnerRef.current;
    if (!section || !header || !container) return;

    /* ── Split heading into words ── */
    if (heading && window.innerWidth > 768) {
      const text = heading.textContent || "";
      heading.innerHTML = text
        .split(" ")
        .map(
          (w) =>
            `<span class="scroll-word inline-block" style="opacity:0;transform:translateY(40px)">${w}&nbsp;</span>`
        )
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

        const dots = dotRefs.current.filter(Boolean) as HTMLDivElement[];
        const ghosts = ghostRefs.current.filter(Boolean) as HTMLDivElement[];
        const titles = titleRefs.current.filter(Boolean) as HTMLHeadingElement[];
        const descs = descRefs.current.filter(Boolean) as HTMLParagraphElement[];
        const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];

        /* ── Reduced motion ── */
        if (reduceMotion) {
          gsap.set([header, ...items], {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          });
          gsap.set(dots, { autoAlpha: 1, scale: 1 });
          dots.forEach((d) => d.classList.add("active"));
          gsap.set(ghosts, { autoAlpha: 0.06, scale: 1 });
          gsap.set(titles, { autoAlpha: 1, x: 0, filter: "blur(0px)" });
          gsap.set(descs, { autoAlpha: 1, y: 0 });
          if (lineInner) gsap.set(lineInner, { scaleY: 1 });
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          return;
        }

        /* ── Mobile: simple reveal, line on left ── */
        if (isMobile) {
          gsap.from(header, {
            autoAlpha: 0,
            y: 30,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: { trigger: header, start: "top 90%" },
          });

          /* Line grow */
          if (lineInner) {
            gsap.to(lineInner, {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 0.8,
              },
            });
          }

          items.forEach((item, i) => {
            gsap.from(item, {
              autoAlpha: 0,
              y: 50,
              duration: DUR.base,
              ease: EASE.enterSoft,
              scrollTrigger: { trigger: item, start: "top 85%" },
            });

            if (dots[i]) {
              gsap.from(dots[i], {
                scale: 0.5,
                autoAlpha: 0,
                duration: DUR.fast,
                ease: EASE.elastic,
                scrollTrigger: { trigger: item, start: "top 80%" },
                onComplete: () => dots[i].classList.add("active"),
              });
            }
          });

          return;
        }

        /* ── Desktop ── */
        if (isDesktop) {
          /* Header */
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 80%",
              end: "bottom 50%",
              scrub: 0.8,
            },
          });

          const eyebrow = header.querySelector(".eyebrow");
          if (eyebrow) {
            headerTl.from(
              eyebrow,
              { autoAlpha: 0, x: -30, filter: "blur(4px)", duration: 0.08, ease: EASE.enterSoft },
              0
            );
          }

          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            const perWord = 0.3 / Math.max(words.length, 1);
            words.forEach((word, i) => {
              headerTl.to(
                word,
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: DUR.slow / 10,
                  ease: EASE.enter,
                },
                0.05 + i * perWord
              );
            });
          }

          /* Master line progress */
          if (lineInner) {
            gsap.to(lineInner, {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 0.8,
              },
            });
          }

          /* Per-item animations */
          items.forEach((item, i) => {
            const isLeft = i % 2 === 0;

            const itemTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 0.8,
              },
            });

            /* 1. Dot */
            if (dots[i]) {
              itemTl.fromTo(
                dots[i],
                { scale: 0.5, autoAlpha: 0 },
                {
                  scale: 1,
                  autoAlpha: 1,
                  duration: DUR.base,
                  ease: EASE.enter,
                  onComplete: () => dots[i].classList.add("active"),
                },
                0
              );
            }

            /* 2. Ghost number */
            if (ghosts[i]) {
              itemTl.fromTo(
                ghosts[i],
                { autoAlpha: 0, scale: 1.5 },
                {
                  autoAlpha: 0.06,
                  scale: 1,
                  duration: DUR.slow,
                  ease: EASE.enter,
                },
                0
              );
            }

            /* 3. Title from alternating x */
            if (titles[i]) {
              const xFrom = isLeft ? -80 : 80;
              itemTl.fromTo(
                titles[i],
                { autoAlpha: 0, x: xFrom, filter: "blur(6px)" },
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

            /* 4. Description */
            if (descs[i]) {
              itemTl.fromTo(
                descs[i],
                { autoAlpha: 0, y: 30 },
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
      {/* Section Header */}
      <div className="mx-auto max-w-[var(--container-max)] px-6 mb-16">
        <div ref={headerRef}>
          <span className="eyebrow mb-4 inline-flex items-center gap-3 font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            <span className="eyebrow-line inline-block h-px w-8 bg-[var(--purple-light)]" />
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

      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-[var(--container-max)] px-6"
      >
        {/* Vertical timeline line */}
        <div className="timeline-line" ref={lineRef}>
          <div ref={lineInnerRef} className="timeline-line-inner" />
        </div>

        {/* Timeline items */}
        {WHY_ITEMS.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={item.number}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative grid grid-cols-[1fr_auto_1fr] gap-8 py-16 md:py-20 max-md:grid-cols-[40px_1fr] max-md:gap-4 max-md:py-10"
            >
              {/* Left column */}
              <div
                className={`flex flex-col justify-center max-md:hidden${
                  !isLeft ? " md:order-3" : ""
                }`}
              >
                {isLeft && (
                  <div className="md:text-right">
                    <div
                      ref={(el) => {
                        ghostRefs.current[i] = el;
                      }}
                      className="ghost-num absolute -top-4 right-0 max-md:hidden"
                      aria-hidden="true"
                    >
                      {item.number}
                    </div>
                    <h4
                      ref={(el) => {
                        titleRefs.current[i] = el;
                      }}
                      className="mb-2 font-[var(--font-heading)] text-xl font-semibold text-[var(--text-1,#fff)]"
                    >
                      {item.title}
                    </h4>
                    <p
                      ref={(el) => {
                        descRefs.current[i] = el;
                      }}
                      className="ml-auto max-w-sm text-[var(--text-2,var(--gray-400))]"
                    >
                      {item.desc}
                    </p>
                  </div>
                )}
              </div>

              {/* Center dot */}
              <div className="relative flex items-start justify-center pt-2 max-md:flex max-md:items-start max-md:justify-center">
                <div
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="timeline-dot flex items-center justify-center text-[10px] font-bold text-[var(--cyan)]"
                  style={{
                    position: "relative",
                    left: "auto",
                    transform: "none",
                    width: "32px",
                    height: "32px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.number}
                </div>
              </div>

              {/* Right column */}
              <div
                className={`flex flex-col justify-center max-md:hidden${
                  isLeft ? " md:order-1" : ""
                }`}
              >
                {!isLeft && (
                  <div>
                    <div
                      ref={(el) => {
                        /* Only assign ghost ref once per item */
                        if (!isLeft) ghostRefs.current[i] = el;
                      }}
                      className="ghost-num absolute -top-4 left-0 max-md:hidden"
                      aria-hidden="true"
                    >
                      {item.number}
                    </div>
                    <h4
                      ref={(el) => {
                        if (!isLeft) titleRefs.current[i] = el;
                      }}
                      className="mb-2 font-[var(--font-heading)] text-xl font-semibold text-[var(--text-1,#fff)]"
                    >
                      {item.title}
                    </h4>
                    <p
                      ref={(el) => {
                        if (!isLeft) descRefs.current[i] = el;
                      }}
                      className="max-w-sm text-[var(--text-2,var(--gray-400))]"
                    >
                      {item.desc}
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile-only content (always right of dot) */}
              <div className="hidden max-md:block">
                <h4
                  ref={(el) => {
                    /* On mobile, these are the visible title/desc.
                       Only assign refs if not already assigned by desktop columns. */
                    if (typeof window !== "undefined" && window.innerWidth <= 768) {
                      titleRefs.current[i] = el;
                    }
                  }}
                  className="mb-1 font-[var(--font-heading)] text-lg font-semibold text-[var(--text-1,#fff)]"
                >
                  {item.title}
                </h4>
                <p
                  ref={(el) => {
                    if (typeof window !== "undefined" && window.innerWidth <= 768) {
                      descRefs.current[i] = el;
                    }
                  }}
                  className="text-sm text-[var(--text-2,var(--gray-400))] leading-relaxed"
                >
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
