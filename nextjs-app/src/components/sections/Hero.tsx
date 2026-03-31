"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import { TYPING_PHRASES, WHATSAPP_URL } from "@/lib/constants";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import ConstellationScene from "@/components/visuals/ConstellationScene";
import Button from "@/components/ui/Button";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const originalHTML = useRef<string>("");
  const typingText = useTypingEffect(TYPING_PHRASES);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const scrollIndicator = scrollRef.current;
    const badge = badgeRef.current;
    const eyebrowLine = eyebrowLineRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const buttons = buttonsRef.current;
    const trust = trustRef.current;
    if (!section || !content) return;

    const staticLine = heading?.querySelector(".hero-static") as HTMLElement | null;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions!;

        /* ═══════════════════════════════════════════════
         *  DESKTOP
         * ═══════════════════════════════════════════════ */
        if (isDesktop) {
          // -- Char split on static heading text --
          if (staticLine) {
            originalHTML.current = staticLine.innerHTML;
            const text = staticLine.textContent || "";
            staticLine.innerHTML = text
              .split("")
              .map((ch) =>
                ch === " "
                  ? " "
                  : `<span class="char-reveal" style="display:inline-block">${ch}</span>`
              )
              .join("");
          }

          const chars = staticLine?.querySelectorAll(".char-reveal");

          const entranceTl = gsap.timeline({ delay: 0.5 });

          // 1. Eyebrow
          if (badge) {
            gsap.set(badge, { autoAlpha: 0, x: -30 });
            entranceTl.to(badge, {
              autoAlpha: 1,
              x: 0,
              duration: DUR.base,
              ease: EASE.enterSoft,
            });
          }
          if (eyebrowLine) {
            gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: "left center" });
            entranceTl.to(
              eyebrowLine,
              {
                scaleX: 1,
                duration: DUR.base,
                ease: EASE.enterSoft,
              },
              "<"
            );
          }

          // 2. Heading chars
          if (chars && chars.length > 0) {
            gsap.set(chars, {
              autoAlpha: 0,
              y: 30,
              rotateX: -60,
            });
            entranceTl.to(
              chars,
              {
                autoAlpha: 1,
                y: 0,
                rotateX: 0,
                duration: DUR.slow,
                ease: EASE.enter,
                stagger: 0.025,
              },
              "-=0.4"
            );
          }

          // 3. Subtitle
          if (subtitle) {
            gsap.set(subtitle, {
              autoAlpha: 0,
              y: 20,
              filter: "blur(6px)",
            });
            entranceTl.to(
              subtitle,
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: DUR.base,
                ease: EASE.enterSoft,
              },
              "-=0.5"
            );
          }

          // 4. Buttons
          if (buttons) {
            gsap.set(buttons.children, {
              autoAlpha: 0,
              y: 15,
              scale: 0.95,
            });
            entranceTl.to(
              buttons.children,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: DUR.base,
                ease: EASE.spring,
              },
              "-=0.3"
            );
          }

          // 5. Trust badges
          if (trust) {
            gsap.set(trust.children, { autoAlpha: 0, y: 10 });
            entranceTl.to(
              trust.children,
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.06,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.2"
            );
          }

          // 6. Scroll indicator + infinite yoyo
          if (scrollIndicator) {
            gsap.set(scrollIndicator, { autoAlpha: 0 });
            entranceTl.to(scrollIndicator, {
              autoAlpha: 1,
              duration: DUR.fast,
              ease: EASE.enterSoft,
            });
            entranceTl.to(
              scrollIndicator,
              {
                y: 6,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
              },
              ">"
            );
          }

          // -- Desktop scroll-away (pinned) --
          const pinTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=50vh",
              pin: true,
              anticipatePin: 1,
              scrub: 1.5,
            },
          });

          if (overlay) {
            pinTl.to(
              overlay,
              {
                backgroundColor: "rgba(6,6,11,0.8)",
                ease: "none",
              },
              0
            );
          }

          pinTl.to(
            content,
            {
              autoAlpha: 0,
              y: -80,
              scale: 0.95,
              ease: "none",
            },
            0
          );

          // Scroll indicator fades over first 10%
          if (scrollIndicator) {
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "10% top",
              scrub: true,
              onUpdate: (self) => {
                gsap.set(scrollIndicator, {
                  autoAlpha: 1 - self.progress,
                });
              },
            });
          }
        }

        /* ═══════════════════════════════════════════════
         *  MOBILE
         * ═══════════════════════════════════════════════ */
        if (!isDesktop) {
          // Word-by-word on heading static text
          if (staticLine) {
            originalHTML.current = staticLine.innerHTML;
            const text = staticLine.textContent || "";
            const words = text.split(/\s+/).filter(Boolean);
            staticLine.innerHTML = words
              .map(
                (w) =>
                  `<span class="word-reveal" style="display:inline-block;margin-right:0.25em">${w}</span>`
              )
              .join("");
          }

          const wordSpans = staticLine?.querySelectorAll(".word-reveal");

          const mobileTl = gsap.timeline({ delay: 0.5 });

          // Eyebrow
          if (badge) {
            gsap.set(badge, { autoAlpha: 0, y: 15 });
            mobileTl.to(badge, {
              autoAlpha: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.enterSoft,
            });
          }

          // Heading words
          if (wordSpans && wordSpans.length > 0) {
            gsap.set(wordSpans, { autoAlpha: 0, y: 15 });
            mobileTl.to(
              wordSpans,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR.slow,
                ease: EASE.enter,
                stagger: 0.06,
              },
              "-=0.4"
            );
          }

          // Subtitle
          if (subtitle) {
            gsap.set(subtitle, { autoAlpha: 0, y: 10 });
            mobileTl.to(
              subtitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.enterSoft,
              },
              "-=0.5"
            );
          }

          // Buttons
          if (buttons) {
            gsap.set(buttons.children, { autoAlpha: 0, y: 8, scale: 0.95 });
            mobileTl.to(
              buttons.children,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: 0.1,
                duration: DUR.base,
                ease: EASE.spring,
              },
              "-=0.3"
            );
          }

          // Trust badges
          if (trust) {
            gsap.set(trust.children, { autoAlpha: 0, y: 5 });
            mobileTl.to(
              trust.children,
              {
                autoAlpha: 1,
                y: 0,
                stagger: STAGGER.large,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.2"
            );
          }

          // Scroll indicator
          if (scrollIndicator) {
            gsap.set(scrollIndicator, { autoAlpha: 0 });
            mobileTl.to(scrollIndicator, {
              autoAlpha: 1,
              duration: DUR.fast,
              ease: EASE.enterSoft,
            });
            mobileTl.to(
              scrollIndicator,
              {
                y: 6,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
              },
              ">"
            );
          }

          // Mobile scroll-away (no pin)
          const scrollAwayTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });

          scrollAwayTl.to(content, {
            autoAlpha: 0,
            y: -40,
            ease: "none",
          });

          if (overlay) {
            scrollAwayTl.to(
              overlay,
              {
                backgroundColor: "rgba(6,6,11,0.8)",
                ease: "none",
              },
              0
            );
          }

          if (scrollIndicator) {
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "15% top",
              scrub: true,
              onUpdate: (self) => {
                gsap.set(scrollIndicator, {
                  autoAlpha: 1 - self.progress,
                });
              },
            });
          }
        }

        return () => {
          // Restore original HTML on context cleanup
          if (staticLine && originalHTML.current) {
            staticLine.innerHTML = originalHTML.current;
            originalHTML.current = "";
          }
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Dim overlay for scroll-away */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[3]"
      />

      {/* ConstellationScene -- right half on desktop, full bg on mobile */}
      <div className="absolute inset-0 md:left-1/2 z-[1]">
        <ConstellationScene />
      </div>

      {/* Content grid */}
      <div
        ref={contentRef}
        className="relative z-[5] mx-auto grid min-h-screen max-w-[var(--container)] grid-cols-1 items-center px-6 pt-24 pb-12 md:grid-cols-2"
      >
        <div className="flex flex-col justify-center text-center md:text-left md:pr-12">
          {/* Eyebrow */}
          <div
            ref={badgeRef}
            className="mb-5 inline-flex items-center gap-2.5 self-center md:self-start rounded-full border border-[var(--border-default)] bg-[var(--surface-card)]/60 px-4 py-2 text-xs font-medium uppercase tracking-[2px] text-[var(--text-2)] backdrop-blur-sm"
          >
            <span
              ref={eyebrowLineRef}
              className="inline-block h-px w-5 bg-[var(--cyan)]"
            />
            Operadora Verificada Pro
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mb-6 font-[var(--font-heading)] text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[1.08] text-[var(--text-1)]"
            style={{ perspective: "600px" }}
          >
            <span className="hero-static">Tu aliada experta en el</span>
            <br />
            <span className="gradient-text">
              {typingText}
              <span
                className="ml-0.5 inline-block w-[2px] animate-[typing-cursor_1s_infinite] bg-[var(--cyan)] align-middle"
                style={{ height: "0.9em" }}
              />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mb-8 max-w-lg text-lg text-[var(--text-2)] mx-auto md:mx-0"
          >
            La cuenta P2P mas grande de Mexico.{" "}
            <strong className="text-[var(--text-1)]">83,000+</strong> operaciones
            exitosas, los mejores precios y atencion 24/7.
          </p>

          {/* CTAs */}
          <div
            ref={buttonsRef}
            className="mb-8 flex flex-wrap justify-center md:justify-start gap-4"
          >
            <Button href={WHATSAPP_URL} target="_blank" rel="noopener">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Operar Ahora
            </Button>
            <Button href="#servicios" variant="outline">
              Explorar Servicios
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            ref={trustRef}
            className="flex flex-wrap justify-center md:justify-start gap-5 text-sm text-[var(--text-3)]"
          >
            {["KYC Verificada", "Comerciante Pro", "100% Completadas"].map(
              (t) => (
                <span key={t} className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-[var(--mint)]"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        {/* Right side is empty on desktop (ConstellationScene fills it via absolute) */}
        <div className="hidden md:block" />
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1 text-[var(--text-3)]">
          <span className="text-[0.6rem] uppercase tracking-[3px]">Scroll</span>
          <div className="h-6 w-px bg-gradient-to-b from-[var(--cyan)]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
