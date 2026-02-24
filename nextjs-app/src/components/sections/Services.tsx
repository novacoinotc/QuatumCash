"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import ServiceCard from "@/components/ui/ServiceCard";
import ExchangeFlow from "@/components/visuals/ExchangeFlow";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>();

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const flow = flowRef.current;
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!section || !header || !grid) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;

    if (prefersReduced) {
      gsap.set([header, ...Array.from(grid.children)], { opacity: 1, y: 0 });
      if (heading) gsap.set(heading.querySelectorAll(".scroll-word"), { y: 0, opacity: 1 });
      return;
    }

    if (isMobile) {
      const headerTl = gsap.timeline({
        scrollTrigger: { trigger: header, start: "top 90%", end: "bottom 70%", scrub: 1 },
      });
      headerTl.from(header, { opacity: 0, y: 20, duration: 1 });

      if (flow) {
        const flowTl = gsap.timeline({
          scrollTrigger: { trigger: flow, start: "top 90%", end: "bottom 60%", scrub: 1 },
        });
        const mxnCard = flow.querySelector(".flow-card-left");
        const cryptoCard = flow.querySelector(".flow-card-right");
        const hexCenter = flow.querySelector(".flow-center");
        if (mxnCard && cryptoCard && hexCenter) {
          flowTl.from(mxnCard, { opacity: 0, y: 20, duration: 1 });
          flowTl.from(hexCenter, { opacity: 0, scale: 0.8, rotate: -30, duration: 1 }, "-=0.7");
          flowTl.from(cryptoCard, { opacity: 0, y: 20, duration: 1 }, "-=0.7");
        }
      }

      const cardTl = gsap.timeline({
        scrollTrigger: { trigger: grid, start: "top 90%", end: "center center", scrub: 1 },
      });
      cardTl.from(grid.children, { opacity: 0, y: 20, stagger: 0.05, duration: 0.8 });

      return () => {
        headerTl.scrollTrigger?.kill(); headerTl.kill();
        cardTl.scrollTrigger?.kill(); cardTl.kill();
      };
    }

    // Desktop: pinned fullscreen
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

    // 0-0.05: Label
    const label = header.querySelector(".services-label");
    if (label) {
      tl.from(label, { opacity: 0, y: 20, duration: 0.05 }, 0);
    }

    // 0.03-0.2: Word-by-word heading
    if (heading) {
      const words = heading.querySelectorAll(".scroll-word");
      if (words.length) {
        words.forEach((word, i) => {
          tl.to(word, {
            y: 0, opacity: 1, duration: 0.03, ease: "power2.out",
          }, 0.03 + i * (0.17 / words.length));
        });
      }
    }

    // 0.18-0.25: Subtitle
    const subtitle = header.querySelector(".services-subtitle");
    if (subtitle) {
      tl.from(subtitle, { opacity: 0, y: 20, duration: 0.08 }, 0.18);
    }

    // 0.25-0.5: ExchangeFlow dramatic entrance
    if (flow) {
      const mxnCard = flow.querySelector(".flow-card-left");
      const cryptoCard = flow.querySelector(".flow-card-right");
      const hexCenter = flow.querySelector(".flow-center");
      if (mxnCard && cryptoCard && hexCenter) {
        tl.from(mxnCard, { opacity: 0, x: -120, rotateY: 30, scale: 0.7, duration: 0.12 }, 0.25);
        tl.from(hexCenter, { opacity: 0, scale: 0, rotate: -180, duration: 0.12, ease: "elastic.out(1, 0.6)" }, 0.32);
        tl.from(cryptoCard, { opacity: 0, x: 120, rotateY: -30, scale: 0.7, duration: 0.12 }, 0.32);
      }
    }

    // 0.5-0.9: Service cards stagger
    const cards = Array.from(grid.children);
    cards.forEach((card, i) => {
      tl.from(card, {
        opacity: 0, y: 50, rotateY: i % 2 === 0 ? 25 : -25, duration: 0.1,
      }, 0.5 + i * 0.06);
    });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="section-pinned perspective-section relative"
      style={{ zIndex: 3, backgroundColor: "var(--bg-services)" }}
    >
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-50 max-md:hidden" viewBox="0 0 1200 800" fill="none">
          <line x1="100" y1="200" x2="300" y2="100" stroke="#7C3AED" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="300" y1="100" x2="500" y2="250" stroke="#A78BFA" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="150" x2="900" y2="300" stroke="#F472B6" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.12;0.05" dur="4s" repeatCount="indefinite" />
          </line>
          <g opacity="0.25"><circle cx="100" cy="200" r="4" fill="#7C3AED" /><circle cx="100" cy="200" r="8" stroke="#7C3AED" strokeWidth="0.5" fill="none" opacity="0.3" /></g>
          <g opacity="0.2"><circle cx="300" cy="100" r="3" fill="#A78BFA" /></g>
          <g opacity="0.2"><circle cx="500" cy="250" r="3.5" fill="#F472B6" /></g>
          <circle r="2" fill="#F472B6" opacity="0.5">
            <animateMotion dur="8s" repeatCount="indefinite" path="M100,200 L300,100 L500,250 L700,150 L900,300 L1100,200" />
          </circle>
        </svg>
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div ref={headerRef} className="mb-12 text-center">
          <span className="services-label mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            Servicios
          </span>
          <h2 ref={headingRef} className="mb-4 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
            Todo lo que necesitas, en un solo lugar
          </h2>
          <p className="services-subtitle mx-auto max-w-xl text-[var(--gray-400)]">
            Desde la compra-venta de criptomonedas hasta analisis forense de
            wallets. Soluciones integrales respaldadas por la tecnologia de
            NovaCoin.
          </p>
        </div>

        <div ref={flowRef} style={{ perspective: "1200px" }}>
          <ExchangeFlow />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1000px" }}>
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} icon={service.icon} title={service.title} desc={service.desc} tags={service.tags} />
          ))}
        </div>
      </div>
    </section>
  );
}
