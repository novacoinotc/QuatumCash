"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, DUR, STAGGER } from "@/lib/animation";
import { WHATSAPP_URL, NOVACOIN_URL } from "@/lib/constants";
import Button from "@/components/ui/Button";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const buttons = buttonsRef.current;
    const details = detailsRef.current;
    if (!section || !heading) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(
        [orb1, orb2, eyebrow, heading, desc, buttons, details].filter(Boolean),
        { autoAlpha: 1, y: 0, scale: 1 }
      );
      if (buttons) gsap.set(buttons.children, { autoAlpha: 1, y: 0, scale: 1 });
      if (details) gsap.set(details.children, { autoAlpha: 1, y: 0 });
      return;
    }

    // Hide elements before animation (GSAP controls visibility, not inline styles)
    gsap.set([orb1, orb2, eyebrow, desc].filter(Boolean), { autoAlpha: 0 });
    if (buttons) gsap.set(buttons.children, { autoAlpha: 0 });
    if (details) gsap.set(details.children, { autoAlpha: 0 });

    // Split heading into words for word-by-word animation
    const headingText = heading.textContent || "";
    heading.innerHTML = headingText
      .split(" ")
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="contact-word inline-block">${word}</span></span>`
      )
      .join(" ");
    const words = heading.querySelectorAll(".contact-word");

    const mm = gsap.matchMedia();

    // --- Desktop ---
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Beat 1: Orbs
      if (orb1) {
        tl.fromTo(
          orb1,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 0.15, scale: 1, duration: DUR.glacial, ease: EASE.enterSoft },
          0
        );
      }
      if (orb2) {
        tl.fromTo(
          orb2,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 0.15, scale: 1, duration: DUR.glacial, ease: EASE.enterSoft },
          0
        );
      }

      // Beat 2: Eyebrow
      if (eyebrow) {
        tl.from(
          eyebrow,
          { autoAlpha: 0, y: 50, duration: DUR.slow, ease: EASE.enter },
          0.1
        );
      }

      // Beat 2b: Heading word-by-word
      if (words.length) {
        tl.fromTo(
          words,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.slow,
            ease: EASE.enter,
            stagger: 0.06,
          },
          0.2
        );
      }

      // Beat 3: Description
      if (desc) {
        tl.from(
          desc,
          { autoAlpha: 0, y: 25, duration: DUR.base, ease: EASE.enterSoft },
          "-=0.8"
        );
      }

      // Beat 4: Buttons
      if (buttons) {
        const btns = buttons.children;
        tl.from(
          btns,
          {
            autoAlpha: 0,
            y: 15,
            scale: 0.95,
            stagger: 0.1,
            duration: DUR.base,
            ease: EASE.spring,
          },
          "-=0.6"
        );
      }

      // Beat 5: Details
      if (details) {
        const items = details.children;
        tl.from(
          items,
          {
            autoAlpha: 0,
            y: 10,
            stagger: 0.1,
            duration: DUR.fast,
            ease: EASE.enterSoft,
          },
          "-=0.4"
        );
      }

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // --- Mobile ---
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      if (orb1) {
        tl.fromTo(
          orb1,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 0.15, scale: 1, duration: DUR.slow, ease: EASE.enterSoft },
          0
        );
      }
      if (orb2) {
        tl.fromTo(
          orb2,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 0.15, scale: 1, duration: DUR.slow, ease: EASE.enterSoft },
          0
        );
      }

      if (eyebrow) {
        tl.from(
          eyebrow,
          { autoAlpha: 0, y: 25, duration: DUR.base, ease: EASE.enter },
          0.1
        );
      }

      if (words.length) {
        tl.fromTo(
          words,
          { autoAlpha: 0, y: 25 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.enter,
            stagger: 0.06,
          },
          0.2
        );
      }

      if (desc) {
        tl.from(
          desc,
          { autoAlpha: 0, y: 12, duration: DUR.fast, ease: EASE.enterSoft },
          "-=0.4"
        );
      }

      if (buttons) {
        tl.from(
          buttons.children,
          {
            autoAlpha: 0,
            y: 8,
            scale: 0.95,
            stagger: 0.1,
            duration: DUR.fast,
            ease: EASE.spring,
          },
          "-=0.3"
        );
      }

      if (details) {
        tl.from(
          details.children,
          {
            autoAlpha: 0,
            y: 5,
            stagger: 0.1,
            duration: DUR.fast,
            ease: EASE.enterSoft,
          },
          "-=0.2"
        );
      }

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
      className="relative overflow-hidden py-[var(--section-padding)]"
      style={{ zIndex: 1, backgroundColor: "var(--bg-contact, var(--surface-dark))" }}
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={orb1Ref}
          className="absolute left-1/2 top-1/3 h-[600px] w-[600px] max-md:h-[300px] max-md:w-[300px] -translate-x-3/4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.14) 0%, rgba(0,240,255,0.04) 40%, transparent 70%)",

          }}
        />
        <div
          ref={orb2Ref}
          className="absolute right-1/4 top-1/2 h-[500px] w-[500px] max-md:h-[250px] max-md:w-[250px] -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)",

          }}
        />
      </div>

      {/* Content — single column, centered */}
      <div className="relative mx-auto max-w-[var(--container-max)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="eyebrow mb-4 inline-block"
          >
            <span className="eyebrow-line" />
            Comienza Hoy
          </span>

          {/* Massive heading */}
          <h2
            ref={headingRef}
            className="mb-6 font-[var(--font-primary)] text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.1] text-white"
          >
            Lista para tu proxima operacion?
          </h2>

          {/* Description */}
          <p
            ref={descRef}
            className="mx-auto mb-10 max-w-lg text-lg text-[var(--gray-400)]"
          >
            Escribeme por WhatsApp y recibe una cotizacion personalizada en
            menos de 2 minutos. Sin compromisos, sin letras chiquitas.
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="mb-10 flex flex-wrap items-center justify-center gap-4"
          >
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

          {/* Contact details */}
          <div
            ref={detailsRef}
            className="flex flex-col items-center gap-3 text-sm text-[var(--gray-400)]"
          >
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
      </div>
    </section>
  );
}
