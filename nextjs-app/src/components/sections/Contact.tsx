"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { WHATSAPP_URL, NOVACOIN_URL } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import ChatMockup from "@/components/visuals/ChatMockup";
import Button from "@/components/ui/Button";

export default function Contact() {
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

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([content, visual], { autoAlpha: 1, y: 0 });
      if (heading) gsap.set(heading.querySelectorAll(".scroll-word"), { y: 0, autoAlpha: 1 });
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
          scrub: 1,
        },
      });

      tl.from(content, { autoAlpha: 0, y: 25, duration: 1 });
      tl.from(visual, { autoAlpha: 0, y: 25, duration: 1 }, "-=0.6");

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
          scrub: 1,
        },
      });

      // 0-0.05: Label
      const label = content.querySelector(".contact-label");
      if (label) {
        tl.from(label, { autoAlpha: 0, x: -20, duration: 0.05 }, 0);
      }

      // 0.03-0.25: Word-by-word heading
      if (heading) {
        const words = heading.querySelectorAll(".scroll-word");
        if (words.length) {
          words.forEach((word, i) => {
            tl.to(word, {
              y: 0,
              autoAlpha: 1,
              duration: 0.04,
              ease: "power2.out",
            }, 0.03 + i * (0.22 / words.length));
          });
        }
      }

      // 0.25-0.35: Paragraph
      const paragraph = content.querySelector(".contact-paragraph");
      if (paragraph) {
        tl.from(paragraph, {
          autoAlpha: 0,
          y: 25,
          filter: "blur(3px)",
          duration: 0.1,
        }, 0.25);
      }

      // 0.35-0.45: Buttons (staggered)
      const buttons = content.querySelectorAll(".contact-buttons > *");
      if (buttons.length) {
        tl.from(buttons, {
          autoAlpha: 0,
          y: 20,
          scale: 0.92,
          stagger: 0.08,
          ease: "back.out(1.5)",
          duration: 0.1,
        }, 0.35);
      }

      // 0.45-0.55: Details (staggered children)
      const detailItems = content.querySelectorAll(".contact-details > *");
      if (detailItems.length) {
        tl.from(detailItems, {
          autoAlpha: 0,
          y: 15,
          stagger: 0.05,
          duration: 0.08,
        }, 0.45);
      }

      // 0.15-0.55: ChatMockup 3D entrance
      tl.from(visual, {
        autoAlpha: 0,
        scale: 0.6,
        rotateY: -15,
        rotateX: 8,
        y: 50,
        duration: 0.4,
        ease: "power3.out",
      }, 0.15);

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
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
        />
        <svg className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-60 max-md:hidden" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="#7C3AED" strokeWidth="0.4" opacity="0.08" strokeDasharray="4 6">
            <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="300" r="220" stroke="#A78BFA" strokeWidth="0.4" opacity="0.06" strokeDasharray="3 8">
            <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="-360 300 300" dur="45s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="300" r="160" stroke="#F472B6" strokeWidth="0.4" opacity="0.06" strokeDasharray="2 10">
            <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="35s" repeatCount="indefinite" />
          </circle>
          <circle cx="580" cy="300" r="3" fill="#F472B6" opacity="0.3">
            <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="520" cy="300" r="2.5" fill="#818CF8" opacity="0.25">
            <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="-360 300 300" dur="16s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div ref={contentRef} style={{ perspective: "1000px" }}>
            <span className="contact-label mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
              Comienza Hoy
            </span>
            <h2 ref={headingRef} className="mb-5 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
              Lista para hacer tu proxima operacion?
            </h2>
            <p className="contact-paragraph mb-8 text-[var(--gray-400)]">
              Escribeme directamente por WhatsApp y recibe una cotizacion
              personalizada en menos de 2 minutos. Sin compromisos, sin letras
              chiquitas.
            </p>
            <div className="contact-buttons mb-8 flex flex-wrap gap-4">
              <Button href={WHATSAPP_URL} target="_blank" rel="noopener" size="lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribeme por WhatsApp
              </Button>
              <Button href={NOVACOIN_URL} target="_blank" rel="noopener" variant="outline" size="lg">
                Conocer NovaCoin
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Button>
            </div>
            <div className="contact-details flex flex-col gap-3 text-sm text-[var(--gray-400)]">
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--purple-light)]">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                contacto@quantumcash.mx
              </div>
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--purple-light)]">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Mexico
              </div>
            </div>
          </div>

          <div ref={visualRef} className="flex justify-center" style={{ perspective: "1000px" }}>
            <ChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
