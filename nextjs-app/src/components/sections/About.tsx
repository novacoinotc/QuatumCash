"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import PhoneMockup from "@/components/visuals/PhoneMockup";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    const heading = headingRef.current;
    if (!section || !content || !visual) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions!;

        const features = content.querySelectorAll(".about-feature");
        const label = content.querySelector(".about-label");
        const paragraphs = content.querySelectorAll(".about-paragraph");

        // Reduced motion: make everything visible, no animation
        if (reduceMotion) {
          gsap.set([content, visual], { autoAlpha: 1, x: 0, y: 0 });
          gsap.set(features, { autoAlpha: 1, y: 0 });
          if (label) gsap.set(label, { autoAlpha: 1, x: 0 });
          gsap.set(paragraphs, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          if (heading) {
            gsap.set(heading.querySelectorAll(".scroll-word"), {
              y: 0,
              autoAlpha: 1,
            });
          }
          return;
        }

        if (isMobile) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          });

          tl.from(content, { autoAlpha: 0, y: 30, duration: 1 });
          tl.from(visual, { autoAlpha: 0, y: 30, duration: 1 }, "-=0.6");
          if (features.length) {
            tl.from(
              features,
              { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.5 },
              "-=0.4"
            );
          }
          return;
        }

        // Desktop: pinned fullscreen with internal scrub
        if (isDesktop) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=150vh",
              pin: true,
              anticipatePin: 1,
              scrub: 1,
            },
          });

          // 0-0.08: Label slide in from left
          if (label) {
            tl.from(
              label,
              { autoAlpha: 0, x: -30, duration: 0.08 },
              0
            );
          }

          // 0.05-0.35: Word-by-word heading reveal
          if (heading) {
            const words = heading.querySelectorAll(".scroll-word");
            if (words.length) {
              words.forEach((word, i) => {
                const pos = 0.05 + i * (0.3 / words.length);
                tl.to(
                  word,
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.04,
                    ease: "power2.out",
                  },
                  pos
                );
              });
            }
          }

          // 0.3-0.5: Paragraphs with blur
          if (paragraphs.length) {
            tl.from(
              paragraphs,
              {
                autoAlpha: 0,
                y: 30,
                filter: "blur(3px)",
                stagger: 0.06,
                duration: 0.15,
              },
              0.3
            );
          }

          // 0.35-0.65: Phone mockup 3D entrance
          tl.from(
            visual,
            {
              autoAlpha: 0,
              scale: 0.7,
              rotateY: -20,
              x: 80,
              duration: 0.3,
              ease: "power3.out",
            },
            0.35
          );

          // 0.55-0.85: Feature cards stagger
          if (features.length) {
            tl.from(
              features,
              {
                autoAlpha: 0,
                x: -40,
                rotateY: 8,
                stagger: 0.07,
                duration: 0.12,
                ease: "back.out(1.4)",
              },
              0.55
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
      id="sobre-mi"
      className="section-pinned perspective-section relative"
      style={{ zIndex: 5, backgroundColor: "var(--bg-about)" }}
    >
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <svg
          className="absolute left-0 top-0 h-full w-[200px] opacity-60 max-md:hidden"
          viewBox="0 0 200 800"
          fill="none"
        >
          <path
            d="M100,0 C150,80 50,160 100,240 C150,320 50,400 100,480 C150,560 50,640 100,720 C130,780 80,800 100,800"
            stroke="url(#about-helix-g)"
            strokeWidth="0.6"
            opacity="0.12"
            fill="none"
            strokeDasharray="5 8"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-130" dur="6s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="about-helix-g" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
              <stop offset="20%" stopColor="#7C3AED" />
              <stop offset="80%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div ref={contentRef} className="will-change-clip">
            <span className="about-label mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
              Quien Soy
            </span>
            <h2 ref={headingRef} className="mb-5 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
              Detras de cada operacion, hay alguien que cuida tu dinero
            </h2>
            <p className="about-paragraph mb-4 text-[var(--gray-400)]">
              Soy operadora profesional de{" "}
              <strong className="text-white">NovaCoin.mx</strong>, la plataforma
              lider de intercambio de criptomonedas en Mexico. Con mas de{" "}
              <strong className="text-white">700 dias</strong> de trayectoria
              ininterrumpida y{" "}
              <strong className="text-white">16,000+ contrapartes</strong> que
              han confiado en mi servicio, me he consolidado como la cuenta P2P
              mas grande del pais.
            </p>
            <p className="about-paragraph mb-8 text-[var(--gray-400)]">
              Mi compromiso es brindarte una experiencia impecable: precios
              competitivos que nadie mas te ofrece, tiempos de respuesta que
              desafian lo convencional y una atencion personalizada que te hace
              sentir que tu operacion es la unica que importa. Porque asi es.
            </p>

            <div className="flex flex-col gap-4" style={{ perspective: "800px" }}>
              <div className="about-feature flex items-start gap-4 rounded-xl border border-[var(--dark-border)]/50 bg-[var(--dark-card)]/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple)]/10 text-[var(--purple-light)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                </div>
                <div>
                  <strong className="text-sm text-white">Velocidad inigualable</strong>
                  <span className="block text-xs text-[var(--gray-500)]">7 min promedio de liberacion</span>
                </div>
              </div>
              <div className="about-feature flex items-start gap-4 rounded-xl border border-[var(--dark-border)]/50 bg-[var(--dark-card)]/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple)]/10 text-[var(--purple-light)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div>
                  <strong className="text-sm text-white">Seguridad absoluta</strong>
                  <span className="block text-xs text-[var(--gray-500)]">Deposito de garantia en USDT</span>
                </div>
              </div>
              <div className="about-feature flex items-start gap-4 rounded-xl border border-[var(--dark-border)]/50 bg-[var(--dark-card)]/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple)]/10 text-[var(--purple-light)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                </div>
                <div>
                  <strong className="text-sm text-white">Atencion excepcional</strong>
                  <span className="block text-xs text-[var(--gray-500)]">Servicio premium 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={visualRef} className="flex justify-center" style={{ perspective: "1000px" }}>
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
