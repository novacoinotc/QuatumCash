"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { TYPING_PHRASES, WHATSAPP_URL } from "@/lib/constants";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { useParallax } from "@/hooks/useParallax";
import ConstellationScene from "@/components/visuals/ConstellationScene";
import OrbitalRings from "@/components/visuals/OrbitalRings";
import Button from "@/components/ui/Button";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
  const glow3Ref = useParallax<HTMLDivElement>({ speed: -20 });

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const orbital = orbitalRef.current;
    const badge = badgeRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const buttons = buttonsRef.current;
    const trust = trustRef.current;
    if (!section || !content) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
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
          return;
        }

        // ═══════════════════════════════════════════════════════════
        //  DESKTOP ANIMATIONS
        // ═══════════════════════════════════════════════════════════
        if (isDesktop) {
          // --- Entrance Timeline ---
          const entranceTl = gsap.timeline({ delay: 0.3 });

          // 1. Badge drops in with blur dissolve
          if (badge) {
            entranceTl.from(badge, {
              y: -30,
              autoAlpha: 0,
              filter: "blur(8px)",
              duration: 0.6,
              ease: "power3.out",
            });
          }

          // 2. Heading — main text sweeps up with subtle 3D tilt
          if (heading) {
            entranceTl.from(
              heading,
              {
                y: 60,
                autoAlpha: 0,
                rotateX: -10,
                duration: 0.9,
                ease: "power4.out",
              },
              "-=0.2"
            );

            // Gradient span reveals via clipPath wipe
            const gradientSpan = heading.querySelector(".gradient-text");
            if (gradientSpan) {
              entranceTl.from(
                gradientSpan,
                {
                  clipPath: "inset(0 100% 0 0)",
                  duration: 1.2,
                  ease: "power4.out",
                },
                "<0.3"
              );
            }
          }

          // 3. Subtitle fades up with soft blur
          if (subtitle) {
            entranceTl.from(
              subtitle,
              {
                autoAlpha: 0,
                y: 25,
                filter: "blur(4px)",
                duration: 0.7,
                ease: "power3.out",
              },
              "-=0.4"
            );
          }

          // 4. Buttons pop in with elastic spring
          if (buttons) {
            entranceTl.from(
              buttons.children,
              {
                autoAlpha: 0,
                y: 20,
                scale: 0.9,
                stagger: 0.12,
                duration: 0.6,
                ease: "back.out(1.7)",
              },
              "-=0.3"
            );
          }

          // 5. Trust badges cascade in
          if (trust) {
            entranceTl.from(
              trust.children,
              {
                autoAlpha: 0,
                y: 10,
                stagger: 0.06,
                duration: 0.4,
                ease: "power3.out",
              },
              "-=0.2"
            );
          }

          // 6. Scroll indicator appears after everything settles
          if (scrollIndicator) {
            entranceTl.from(
              scrollIndicator,
              {
                autoAlpha: 0,
                y: -10,
                duration: 0.5,
                ease: "power2.out",
              },
              "+=0.2"
            );
          }

          // --- Pin + Cinematic Scroll-Away ---
          const pinTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=60vh",
              pin: true,
              anticipatePin: 1,
              scrub: 0.8,
            },
          });

          // Content dissolves with depth + blur
          pinTl.to(content, {
            autoAlpha: 0,
            scale: 0.85,
            y: -60,
            rotateX: 5,
            filter: "blur(6px)",
            ease: "none",
          });

          // Orbital rings drift away in parallel
          if (orbital) {
            pinTl.to(
              orbital,
              {
                y: -40,
                scale: 0.92,
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

          // Scroll indicator fades out over first 10% of scroll
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
          // --- Mobile Entrance: simple stagger ---
          gsap.from(content.children, {
            autoAlpha: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.5,
            delay: 0.3,
            ease: "power3.out",
          });

          // --- Mobile Scroll-Away ---
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
            y: -20,
            ease: "none",
          });

          // Scroll indicator fade on mobile too
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

        // matchMedia cleanup — kills all tweens/ScrollTriggers in this context
        return () => {};
      }
    );

    // Master cleanup: revert all matchMedia contexts
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="section-pinned perspective-section relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
      style={{ zIndex: 6, backgroundColor: "var(--bg-hero)" }}
    >
      <ConstellationScene />

      {/* Glow orbs */}
      <div
        ref={glow1Ref}
        className="hero-glow-orb pointer-events-none absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        ref={glow2Ref}
        className="hero-glow-orb pointer-events-none absolute right-1/4 top-1/3 h-[350px] w-[350px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        ref={glow3Ref}
        className="hero-glow-orb pointer-events-none absolute bottom-1/4 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
        }}
      />

      <div ref={orbitalRef}>
        <OrbitalRings />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-[var(--container-max)] flex-col items-center px-6 text-center"
        style={{ perspective: "800px" }}
      >
        {/* Badge */}
        <div ref={badgeRef} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--dark-border)] bg-[var(--dark-card)]/80 px-5 py-2.5 text-sm font-medium text-[var(--gray-300)] backdrop-blur-sm">
          <span className="inline-block h-2 w-2 animate-[pulse-dot_2s_infinite] rounded-full bg-emerald-400" />
          Operadora Verificada Pro &bull; NovaCoin.mx
        </div>

        {/* Title */}
        <h1 ref={headingRef} className="mb-6 font-[var(--font-primary)] text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.1] text-white">
          Tu aliada experta en el
          <br />
          <span className="gradient-text">
            {typingText}
            <span className="ml-0.5 inline-block w-[2px] animate-[typing-cursor_1s_infinite] bg-[var(--purple-light)] align-middle" style={{ height: '1em' }} />
          </span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="mb-8 max-w-2xl text-lg text-[var(--gray-400)]">
          Soy la cuenta P2P mas grande de Mexico. Con mas de{" "}
          <strong className="text-white">83,000+ operaciones</strong> exitosas y
          un historial impecable, transformo la manera en que intercambias
          crypto. Rapidez, confianza y los mejores precios del mercado.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="mb-8 flex flex-wrap items-center justify-center gap-4">
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
        <div ref={trustRef} className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--gray-400)]">
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
                  className="text-emerald-400"
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
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="h-8 w-px animate-[scroll-line_2s_infinite] bg-gradient-to-b from-[var(--purple-light)] to-transparent" />
      </div>
    </section>
  );
}
