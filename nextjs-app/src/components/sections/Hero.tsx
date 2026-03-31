"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  EASE,
  DUR,
  STAGGER,
  MOVE,
  MOVE_MOBILE,
  BLUR,
  SCALE,
  SCRUB,
  GLOW,
} from "@/lib/animation";
import { TYPING_PHRASES, WHATSAPP_URL } from "@/lib/constants";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useParallax } from "@/hooks/useParallax";
import ConstellationScene from "@/components/visuals/ConstellationScene";
import OrbitalRings from "@/components/visuals/OrbitalRings";
import Button from "@/components/ui/Button";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const orbitalRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const typingText = useTypingEffect(TYPING_PHRASES);
  const glow1Ref = useParallax<HTMLDivElement>({ speed: -30 });
  const glow2Ref = useParallax<HTMLDivElement>({ speed: -50 });

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const orbital = orbitalRef.current;
    const badge = badgeRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const buttons = buttonsRef.current;
    const trust = trustRef.current;
    if (!section || !content) return;

    // ── Character split for heading static text ──
    // Only split the static line, not the dynamic typing span
    const staticLine = heading?.querySelector(".hero-static-line");
    let originalStaticHTML = "";
    if (staticLine) {
      originalStaticHTML = staticLine.innerHTML;
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

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;

        // ═══ Reduced motion: make everything visible instantly ═══
        if (reduceMotion) {
          gsap.set(
            [badge, heading, subtitle, buttons, trust, scrollIndicator].filter(
              Boolean
            ),
            { autoAlpha: 1, y: 0, scale: 1, filter: "none", clearProps: "all" }
          );
          if (buttons) {
            gsap.set(buttons.children, { autoAlpha: 1, y: 0, scale: 1 });
          }
          if (trust) {
            gsap.set(trust.children, { autoAlpha: 1, y: 0 });
          }
          const chars = heading?.querySelectorAll(".char-reveal");
          if (chars) {
            gsap.set(chars, { autoAlpha: 1, y: 0, rotateX: 0, filter: "none" });
          }
          return;
        }

        // ═══════════════════════════════════════════════════════════
        //  DESKTOP ANIMATIONS
        // ═══════════════════════════════════════════════════════════
        if (isDesktop) {
          const entranceTl = gsap.timeline({ delay: 0.6 });

          // ── Phase 1: Headline char-by-char materialization ──
          const chars = heading?.querySelectorAll(".char-reveal");
          if (chars && chars.length > 0) {
            gsap.set(chars, {
              autoAlpha: 0,
              y: 40,
              rotateX: -90,
              filter: BLUR.enter,
            });

            entranceTl.to(chars, {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              duration: DUR.slow,
              ease: EASE.enter,
              stagger: 0.02,
              onComplete() {
                // Cyan glow flash on all chars after entrance
                gsap.fromTo(
                  chars,
                  { textShadow: `0 0 20px ${GLOW.primary}` },
                  {
                    textShadow: "0 0 0px transparent",
                    duration: 0.4,
                    stagger: 0.02,
                    ease: EASE.enterSoft,
                  }
                );
              },
            });
          }

          // The gradient-text / typing line should also fade in
          const gradientLine = heading?.querySelector(".hero-dynamic-line");
          if (gradientLine) {
            gsap.set(gradientLine, { autoAlpha: 0 });
            entranceTl.to(
              gradientLine,
              {
                autoAlpha: 1,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.8"
            );
          }

          // ── Phase 2: Subtitle ──
          if (subtitle) {
            gsap.set(subtitle, {
              autoAlpha: 0,
              y: 30,
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
              "-=0.6"
            );
          }

          // ── Phase 3: CTAs ──
          if (buttons) {
            gsap.set(buttons.children, {
              autoAlpha: 0,
              y: 20,
              scale: SCALE.enter,
            });
            entranceTl.to(
              buttons.children,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: STAGGER.small,
                duration: DUR.base,
                ease: EASE.spring,
                onComplete() {
                  // Primary CTA border glow pulse
                  const primaryCTA = buttons.children[0] as HTMLElement | undefined;
                  if (primaryCTA) {
                    gsap.fromTo(
                      primaryCTA,
                      { borderColor: "transparent" },
                      {
                        borderColor: GLOW.primary,
                        duration: 0.3,
                        ease: EASE.enterSoft,
                        yoyo: true,
                        repeat: 1,
                      }
                    );
                  }
                },
              },
              "-=0.4"
            );
          }

          // ── Phase 4: Trust badges ──
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
              "-=0.4"
            );
          }

          // ── Phase 5: Scroll indicator + infinite yoyo ──
          if (scrollIndicator) {
            gsap.set(scrollIndicator, { autoAlpha: 0 });
            entranceTl.to(
              scrollIndicator,
              {
                autoAlpha: 1,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.2"
            );
            // Infinite bounce
            entranceTl.to(
              scrollIndicator,
              {
                y: 8,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
              },
              ">"
            );
          }

          // Badge entrance (runs with the heading phase)
          if (badge) {
            gsap.set(badge, { autoAlpha: 0, y: MOVE.y.enter });
            entranceTl.to(
              badge,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.enter,
              },
              0.6 // start at beginning of timeline
            );
          }

          // ── Desktop Pin + Cinematic Scroll-Away ──
          const pinTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=60%",
              pin: true,
              anticipatePin: 1,
              scrub: SCRUB.cinematic,
            },
          });

          // Content dissolves with depth + blur
          pinTl.to(content, {
            autoAlpha: 0,
            scale: SCALE.exit,
            y: -100,
            filter: BLUR.exit,
            ease: "none",
          });

          // Dark overlay dims hero on scroll-away
          if (overlay) {
            pinTl.to(
              overlay,
              {
                backgroundColor: "rgba(10,10,15,0.7)",
                ease: "none",
              },
              0
            );
          }

          // Orbital rings drift away in parallel
          if (orbital) {
            pinTl.to(
              orbital,
              {
                y: -40,
                scale: SCALE.enter,
                autoAlpha: 0,
                ease: "none",
              },
              0
            );
          }

          // Glow orbs scatter at different speeds
          const glowOrbs = section.querySelectorAll(".hero-glow-orb");
          glowOrbs.forEach((orb, i) => {
            pinTl.to(
              orb,
              {
                y: -60 * (i + 1),
                autoAlpha: 0,
                ease: "none",
              },
              0
            );
          });

          // Scroll indicator fades out over first 10%
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

        // ═══════════════════════════════════════════════════════════
        //  MOBILE ANIMATIONS
        // ═══════════════════════════════════════════════════════════
        if (isMobile) {
          const mobileTl = gsap.timeline({ delay: 0.6 });

          // Word-by-word for the static heading line
          if (staticLine) {
            // Re-wrap into words instead of chars for mobile
            const text = staticLine.textContent || "";
            const words = text.split(/\s+/).filter(Boolean);
            staticLine.innerHTML = words
              .map(
                (w) =>
                  `<span class="word-reveal" style="display:inline-block;margin-right:0.25em">${w}</span>`
              )
              .join("");

            const wordSpans = staticLine.querySelectorAll(".word-reveal");
            gsap.set(wordSpans, {
              autoAlpha: 0,
              y: MOVE_MOBILE.y.enter / 2,
            });
            mobileTl.to(wordSpans, {
              autoAlpha: 1,
              y: 0,
              duration: DUR.slow,
              ease: EASE.enter,
              stagger: 0.06,
            });
          }

          // Dynamic line fade-in
          const gradientLine = heading?.querySelector(".hero-dynamic-line");
          if (gradientLine) {
            gsap.set(gradientLine, { autoAlpha: 0 });
            mobileTl.to(
              gradientLine,
              {
                autoAlpha: 1,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.6"
            );
          }

          // Badge
          if (badge) {
            gsap.set(badge, {
              autoAlpha: 0,
              y: MOVE_MOBILE.y.enter / 2,
            });
            mobileTl.to(
              badge,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.enterSoft,
              },
              0.6
            );
          }

          // Subtitle
          if (subtitle) {
            gsap.set(subtitle, {
              autoAlpha: 0,
              y: 15,
            });
            mobileTl.to(
              subtitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.enterSoft,
              },
              "-=0.6"
            );
          }

          // Buttons
          if (buttons) {
            gsap.set(buttons.children, {
              autoAlpha: 0,
              y: 10,
              scale: SCALE.enter,
            });
            mobileTl.to(
              buttons.children,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                stagger: STAGGER.small,
                duration: DUR.base,
                ease: EASE.spring,
              },
              "-=0.4"
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
                stagger: 0.06,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.4"
            );
          }

          // Scroll indicator
          if (scrollIndicator) {
            gsap.set(scrollIndicator, { autoAlpha: 0 });
            mobileTl.to(
              scrollIndicator,
              {
                autoAlpha: 1,
                duration: DUR.fast,
                ease: EASE.enterSoft,
              },
              "-=0.2"
            );
            mobileTl.to(
              scrollIndicator,
              {
                y: 8,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
              },
              ">"
            );
          }

          // ── Mobile Scroll-Away (no pin) ──
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
            y: MOVE_MOBILE.y.exit,
            ease: "none",
          });

          // Overlay dim on mobile scroll
          if (overlay) {
            scrollAwayTl.to(
              overlay,
              {
                backgroundColor: "rgba(10,10,15,0.7)",
                ease: "none",
              },
              0
            );
          }

          // Scroll indicator fade on mobile
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

        // matchMedia cleanup
        return () => {};
      }
    );

    // Master cleanup: revert all matchMedia contexts + restore heading
    return () => {
      mm.revert();
      if (staticLine && originalStaticHTML) {
        staticLine.innerHTML = originalStaticHTML;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="section-pinned perspective-section relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
      style={{ zIndex: 6, backgroundColor: "var(--bg-hero)" }}
    >
      <ConstellationScene />

      {/* Hero dim overlay -- starts transparent, darkens on scroll */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ backgroundColor: "rgba(10,10,15,0)" }}
      />

      {/* Glow orbs with parallax */}
      <div
        ref={glow1Ref}
        className="hero-glow-orb pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        ref={glow2Ref}
        className="hero-glow-orb pointer-events-none absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div ref={orbitalRef}>
        <OrbitalRings />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-[var(--container-max)] flex-col items-center px-6 text-center"
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] backdrop-blur-sm"
        >
          <span className="inline-block h-2 w-2 animate-[pulse-dot_2s_infinite] rounded-full bg-[var(--glow-accent)]" />
          Operadora Verificada Pro &bull; NovaCoin.mx
        </div>

        {/* Heading -- chars will be wrapped in spans dynamically */}
        <h1
          ref={headingRef}
          className="perspective-text mb-6 font-[var(--font-primary)] text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.1] text-white"
        >
          <span className="hero-static-line">Tu aliada experta en el</span>
          {"\n"}
          <span className="hero-dynamic-line">
            <span className="gradient-text">
              {typingText}
              <span
                className="ml-0.5 inline-block w-[2px] animate-[typing-cursor_1s_infinite] bg-[var(--glow-primary)] align-middle"
                style={{ height: "1em" }}
              />
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-8 max-w-2xl text-lg text-[var(--text-secondary)]"
        >
          Soy la cuenta P2P mas grande de Mexico. Con mas de{" "}
          <strong className="text-white">83,000+ operaciones</strong> exitosas y
          un historial impecable, transformo la manera en que intercambias
          crypto. Rapidez, confianza y los mejores precios del mercado.
        </p>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="mb-8 flex flex-wrap items-center justify-center gap-4"
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
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)]"
        >
          {["KYC Verificada", "Comerciante Pro", "100% Completadas"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-[var(--glow-accent)]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
          <span className="text-[0.65rem] uppercase tracking-[2px]">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-[var(--glow-primary)] to-transparent" />
        </div>
      </div>

      <div className="whisper-divider" />
    </section>
  );
}
