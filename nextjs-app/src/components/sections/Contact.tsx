"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, DUR, STAGGER, SCALE, SCRUB } from "@/lib/animation";
import { WHATSAPP_URL, NOVACOIN_URL } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import ChatMockup from "@/components/visuals/ChatMockup";
import Button from "@/components/ui/Button";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    const heading = headingRef.current;
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    if (!section || !content || !visual) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([content, visual], { autoAlpha: 1, y: 0 });
      if (orb1) gsap.set(orb1, { autoAlpha: 0.2, scale: 1 });
      if (orb2) gsap.set(orb2, { autoAlpha: 0.2, scale: 1 });
      if (heading)
        gsap.set(heading.querySelectorAll(".scroll-word"), {
          y: 0,
          autoAlpha: 1,
        });
      return;
    }

    const mm = gsap.matchMedia();

    // --- Mobile ---
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: SCRUB.text,
        },
      });

      tl.from(content, { autoAlpha: 0, y: 40, duration: 1 });
      tl.from(visual, { autoAlpha: 0, y: 40, duration: 1 }, "-=0.6");

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // --- Desktop ---
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=110vh",
          pin: true,
          anticipatePin: 1,
          scrub: SCRUB.cinematic,
        },
      });

      // Beat 1 (0 - 0.15): Ambient glow orbs appear
      if (orb1) {
        tl.fromTo(
          orb1,
          { autoAlpha: 0, scale: 0.5 },
          {
            autoAlpha: 0.2,
            scale: 1,
            duration: 0.15,
            ease: EASE.enterSoft,
          },
          0
        );
      }
      if (orb2) {
        tl.fromTo(
          orb2,
          { autoAlpha: 0, scale: 0.5 },
          {
            autoAlpha: 0.2,
            scale: 1,
            duration: 0.15,
            ease: EASE.enterSoft,
          },
          0
        );
      }

      // Orbs slowly drift via scrub
      if (orb1) {
        tl.to(
          orb1,
          { xPercent: 15, yPercent: -10, duration: 0.85, ease: "none" },
          0.15
        );
      }
      if (orb2) {
        tl.to(
          orb2,
          { xPercent: -12, yPercent: 8, duration: 0.85, ease: "none" },
          0.15
        );
      }

      // Beat 2 (0.1 - 0.3): Eyebrow + word-by-word heading
      const eyebrow = content.querySelector(".eyebrow");
      if (eyebrow) {
        tl.from(
          eyebrow,
          {
            autoAlpha: 0,
            y: 50,
            filter: "blur(6px)",
            duration: 0.1,
            ease: EASE.enter,
          },
          0.1
        );
      }

      if (heading) {
        const words = heading.querySelectorAll(".scroll-word");
        if (words.length) {
          words.forEach((word, i) => {
            tl.to(
              word,
              {
                y: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 0.04,
                ease: EASE.enter,
              },
              0.13 + i * 0.06
            );
          });
        }
      }

      // Beat 3 (0.25 - 0.4): Description + contact info
      const paragraph = content.querySelector(".contact-paragraph");
      if (paragraph) {
        tl.from(
          paragraph,
          {
            autoAlpha: 0,
            y: 30,
            filter: "blur(4px)",
            duration: 0.15,
            ease: EASE.enterSoft,
          },
          0.25
        );
      }

      const detailItems = content.querySelectorAll(".contact-details > *");
      if (detailItems.length) {
        tl.from(
          detailItems,
          {
            autoAlpha: 0,
            x: -40,
            stagger: STAGGER.medium,
            duration: 0.1,
            ease: EASE.enterSoft,
          },
          0.3
        );
      }

      // Beat 4 (0.35 - 0.5): Buttons
      const buttons = content.querySelectorAll(".contact-buttons > *");
      if (buttons.length) {
        tl.from(
          buttons,
          {
            autoAlpha: 0,
            y: 20,
            scale: SCALE.enter,
            stagger: STAGGER.small,
            ease: EASE.spring,
            duration: 0.15,
          },
          0.35
        );
      }

      // Beat 5 (0.2 - 0.6): ChatMockup 3D entrance
      tl.from(
        visual,
        {
          autoAlpha: 0,
          scale: 0.6,
          rotateY: -15,
          rotateX: 8,
          y: 50,
          duration: 0.4,
          ease: EASE.enter,
        },
        0.2
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="section-pinned perspective-section relative"
      style={{ zIndex: 1, backgroundColor: "var(--bg-contact)" }}
    >
      {/* Ambient glow orbs */}
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <div
          ref={orb1Ref}
          className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
            visibility: "hidden",
          }}
        />
        <div
          ref={orb2Ref}
          className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(0,240,255,0.04) 40%, transparent 70%)",
            visibility: "hidden",
          }}
        />
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div ref={contentRef} style={{ perspective: "1000px" }}>
            <span className="eyebrow">
              <span className="eyebrow-line" />
              Comienza Hoy
            </span>
            <h2
              ref={headingRef}
              className="mb-5 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white"
            >
              Lista para hacer tu proxima operacion?
            </h2>
            <p className="contact-paragraph mb-8 text-[var(--gray-400)]">
              Escribeme directamente por WhatsApp y recibe una cotizacion
              personalizada en menos de 2 minutos. Sin compromisos, sin letras
              chiquitas.
            </p>
            <div className="contact-buttons mb-8 flex flex-wrap gap-4">
              <Button
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                size="lg"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribeme por WhatsApp
              </Button>
              <Button
                href={NOVACOIN_URL}
                target="_blank"
                rel="noopener"
                variant="outline"
                size="lg"
              >
                Conocer NovaCoin
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Button>
            </div>
            <div className="contact-details flex flex-col gap-3 text-sm text-[var(--gray-400)]">
              <div className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[var(--glow-primary)]"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                contacto@quantumcash.mx
              </div>
              <div className="flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[var(--glow-primary)]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Mexico
              </div>
            </div>
          </div>

          <div
            ref={visualRef}
            className="flex justify-center"
            style={{ perspective: "1000px" }}
          >
            <ChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
