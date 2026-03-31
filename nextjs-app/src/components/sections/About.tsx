"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import PhoneMockup from "@/components/visuals/PhoneMockup";

/* ── Feature data ── */
const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "7 min promedio",
    desc: "Tiempo de liberacion mas rapido del mercado P2P mexicano",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Garantia USDT",
    desc: "Deposito de garantia que protege cada una de tus operaciones",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: "Soporte 24/7",
    desc: "Atencion premium personalizada a cualquier hora del dia",
  },
] as const;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const phone = phoneRef.current;
    if (!section || !track || !phone) return;

    const mm = gsap.matchMedia();

    /* ── Desktop: fake horizontal scroll ── */
    mm.add("(min-width: 769px)", () => {
      const panels = track.querySelectorAll<HTMLElement>(".hscroll-panel");
      const totalWidth = (panels.length - 1) * window.innerWidth;

      /* Main horizontal tween — ease MUST be "none" for containerAnimation */
      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* ── Panel 1: Intro reveals ── */
      const p1 = panels[0];
      if (p1) {
        const eyebrow = p1.querySelector(".eyebrow");
        const eyebrowLine = p1.querySelector(".eyebrow-line");
        const heading = p1.querySelector("h2");
        const paragraphs = p1.querySelectorAll(".about-paragraph");

        if (eyebrow) {
          gsap.from(eyebrow, {
            autoAlpha: 0,
            x: -30,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: p1,
              start: "left 80%",
              toggleActions: "play none none reset",
            },
          });
        }

        if (eyebrowLine) {
          gsap.from(eyebrowLine, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: DUR.base,
            ease: EASE.enter,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: p1,
              start: "left 80%",
              toggleActions: "play none none reset",
            },
          });
        }

        if (heading) {
          /* Word-by-word reveal */
          const words = heading.querySelectorAll(".about-word");
          if (words.length) {
            gsap.from(words, {
              autoAlpha: 0,
              y: 50,
              rotateX: -30,
              stagger: STAGGER.tight,
              duration: DUR.fast,
              ease: EASE.enter,
              scrollTrigger: {
                containerAnimation: scrollTween,
                trigger: p1,
                start: "left 75%",
                toggleActions: "play none none reset",
              },
            });
          }
        }

        if (paragraphs.length) {
          gsap.from(paragraphs, {
            autoAlpha: 0,
            y: 40,
            stagger: STAGGER.medium,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: p1,
              start: "left 65%",
              toggleActions: "play none none reset",
            },
          });
        }
      }

      /* ── Panel 2: Feature cards stagger ── */
      const p2 = panels[1];
      if (p2) {
        const cards = p2.querySelectorAll(".feature-card");
        gsap.from(cards, {
          autoAlpha: 0,
          y: 60,
          stagger: 0.15,
          duration: DUR.base,
          ease: EASE.spring,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: p2,
            start: "left center",
            toggleActions: "play none none reset",
          },
        });
      }

      /* ── Panel 3: Phone 3D entrance ── */
      const p3 = panels[2];
      if (p3) {
        gsap.from(phone, {
          autoAlpha: 0,
          scale: 0.8,
          rotateY: -15,
          duration: DUR.slow,
          ease: EASE.enter,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: p3,
            start: "left center",
            toggleActions: "play none none reset",
          },
        });

        const trustText = p3.querySelector(".trust-text");
        if (trustText) {
          gsap.from(trustText, {
            autoAlpha: 0,
            y: 30,
            duration: DUR.base,
            ease: EASE.enterSoft,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: p3,
              start: "left 40%",
              toggleActions: "play none none reset",
            },
          });
        }
      }

      return () => {
        scrollTween.kill();
      };
    });

    /* ── Mobile: stacked panels with simple scroll-reveals ── */
    mm.add("(max-width: 768px)", () => {
      const panels = track.querySelectorAll<HTMLElement>(".hscroll-panel");

      panels.forEach((panel) => {
        const children = panel.querySelectorAll(
          ".eyebrow, h2, .about-paragraph, .feature-card, .phone-wrapper, .trust-text"
        );

        gsap.from(children, {
          autoAlpha: 0,
          y: 40,
          stagger: STAGGER.small,
          duration: DUR.base,
          ease: EASE.enterSoft,
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            toggleActions: "play none none reset",
          },
        });
      });
    });

    /* ── Reduced motion ── */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(track.querySelectorAll(".hscroll-panel *"), {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateY: 0,
      });
    });

    return () => mm.revert();
  }, []);

  /* ── Utility: wrap each word in a span for word-by-word reveals ── */
  function wordWrap(text: string) {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        className="about-word inline-block"
        style={{ perspective: "600px" }}
      >
        {word}
        {i < text.split(" ").length - 1 ? "\u00A0" : ""}
      </span>
    ));
  }

  return (
    <section
      ref={sectionRef}
      id="sobre-mi"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-elevated)" }}
    >
      <div ref={trackRef} className="hscroll-track">
        {/* ── Panel 1: Introduction ── */}
        <div className="hscroll-panel">
          <div className="mx-auto max-w-3xl px-6">
            <div className="eyebrow mb-4">
              <span className="eyebrow-line" />
              Quien Soy
            </div>

            <h2 className="mb-6 font-[var(--font-heading)] text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.15] text-[var(--text-1)]">
              {wordWrap(
                "Detras de cada operacion, hay alguien que cuida tu dinero"
              )}
            </h2>

            <p className="about-paragraph mb-4 max-w-xl text-[var(--text-2)]">
              Soy operadora profesional de{" "}
              <strong className="text-[var(--text-1)]">NovaCoin.mx</strong>, la
              plataforma lider de intercambio de criptomonedas en Mexico. Con
              mas de{" "}
              <strong className="text-[var(--text-1)]">700 dias</strong> de
              trayectoria ininterrumpida y{" "}
              <strong className="text-[var(--text-1)]">
                16,000+ contrapartes
              </strong>
              .
            </p>

            <p className="about-paragraph max-w-xl text-[var(--text-2)]">
              Mi compromiso es brindarte precios competitivos, tiempos de
              respuesta que desafian lo convencional y atencion personalizada
              premium.
            </p>
          </div>
        </div>

        {/* ── Panel 2: Features ── */}
        <div className="hscroll-panel">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card glass rounded-2xl p-8 text-center"
              >
                <div className="mb-4 flex justify-center text-[var(--purple-light)]">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-[var(--font-heading)] text-lg font-semibold text-[var(--text-1)]">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--text-2)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel 3: Phone visual + trust ── */}
        <div className="hscroll-panel">
          <div className="flex flex-col items-center gap-8 px-6">
            <div
              ref={phoneRef}
              className="phone-wrapper"
              style={{ perspective: "1000px" }}
            >
              <PhoneMockup />
            </div>
            <p className="trust-text max-w-md text-center text-[var(--text-2)]">
              La plataforma que{" "}
              <strong className="text-[var(--text-1)]">
                83,000+ operadores
              </strong>{" "}
              confian para sus transacciones diarias.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
