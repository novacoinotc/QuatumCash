"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { SERVICES } from "@/lib/constants";
import ServiceCard from "@/components/ui/ServiceCard";
import ExchangeFlow from "@/components/visuals/ExchangeFlow";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const flow = flowRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;

    if (prefersReduced) {
      gsap.set([header, ...Array.from(grid.children)], { opacity: 1, y: 0 });
      return;
    }

    // Header scrub
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: isMobile ? "top 90%" : "top 80%",
        end: isMobile ? "bottom 70%" : "bottom 60%",
        scrub: 1,
      },
    });

    headerTl.from(header, {
      opacity: 0,
      y: isMobile ? 20 : 40,
      duration: 1,
      ease: "power3.out",
    });

    // ExchangeFlow scrub animation
    if (flow) {
      const mxnCard = flow.querySelector(".flow-card-left");
      const cryptoCard = flow.querySelector(".flow-card-right");
      const hexCenter = flow.querySelector(".flow-center");

      if (mxnCard && cryptoCard && hexCenter) {
        const flowTl = gsap.timeline({
          scrollTrigger: {
            trigger: flow,
            start: isMobile ? "top 90%" : "top 80%",
            end: isMobile ? "bottom 60%" : "bottom 50%",
            scrub: 1,
          },
        });

        if (isMobile) {
          // Mobile: simple animations
          flowTl.from(mxnCard, {
            opacity: 0,
            y: 20,
            duration: 1,
          });

          flowTl.from(
            hexCenter,
            {
              opacity: 0,
              scale: 0.8,
              rotate: -30,
              duration: 1,
            },
            "-=0.7"
          );

          flowTl.from(
            cryptoCard,
            {
              opacity: 0,
              y: 20,
              duration: 1,
            },
            "-=0.7"
          );
        } else {
          // Desktop: dramatic 3D entrance
          flowTl.from(mxnCard, {
            opacity: 0,
            x: -120,
            rotateY: 30,
            scale: 0.7,
            duration: 1,
          });

          flowTl.from(
            hexCenter,
            {
              opacity: 0,
              scale: 0,
              rotate: -180,
              duration: 1,
              ease: "elastic.out(1, 0.6)",
            },
            "-=0.7"
          );

          flowTl.from(
            cryptoCard,
            {
              opacity: 0,
              x: 120,
              rotateY: -30,
              scale: 0.7,
              duration: 1,
            },
            "-=0.7"
          );
        }
      }
    }

    // Cards scrub with alternating 3D rotateY
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: isMobile ? "top 90%" : "top 80%",
        end: isMobile ? "center center" : "40% center",
        scrub: 1,
      },
    });

    if (isMobile) {
      cardTl.from(grid.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
      });
    } else {
      // Alternating rotateY per card index
      const cards = Array.from(grid.children);
      cards.forEach((card, i) => {
        cardTl.from(
          card,
          {
            opacity: 0,
            y: 40,
            rotateY: i % 2 === 0 ? 25 : -25,
            duration: 0.8,
            ease: "power3.out",
          },
          i * 0.1
        );
      });
    }

    return () => {
      headerTl.scrollTrigger?.kill();
      headerTl.kill();
      cardTl.scrollTrigger?.kill();
      cardTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="perspective-section relative py-[var(--section-padding)]"
    >
      {/* Background nodes SVG — overflow wrapper */}
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full opacity-50 max-md:hidden"
          viewBox="0 0 1200 800"
          fill="none"
        >
          <line x1="100" y1="200" x2="300" y2="100" stroke="#7C3AED" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="300" y1="100" x2="500" y2="250" stroke="#A78BFA" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="700" y1="150" x2="900" y2="300" stroke="#F472B6" strokeWidth="0.4" opacity="0.1">
            <animate attributeName="opacity" values="0.05;0.12;0.05" dur="4s" repeatCount="indefinite" />
          </line>
          <g opacity="0.25">
            <circle cx="100" cy="200" r="4" fill="#7C3AED" />
            <circle cx="100" cy="200" r="8" stroke="#7C3AED" strokeWidth="0.5" fill="none" opacity="0.3" />
          </g>
          <g opacity="0.2">
            <circle cx="300" cy="100" r="3" fill="#A78BFA" />
          </g>
          <g opacity="0.2">
            <circle cx="500" cy="250" r="3.5" fill="#F472B6" />
          </g>
          <circle r="2" fill="#F472B6" opacity="0.5">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path="M100,200 L300,100 L500,250 L700,150 L900,300 L1100,200"
            />
          </circle>
        </svg>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-6">
        <div ref={headerRef} className="mb-12 text-center">
          <span className="mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
            Servicios
          </span>
          <h2 className="mb-4 font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
            Todo lo que necesitas,
            <br />
            <span className="gradient-text">en un solo lugar</span>
          </h2>
          <p className="mx-auto max-w-xl text-[var(--gray-400)]">
            Desde la compra-venta de criptomonedas hasta analisis forense de
            wallets. Soluciones integrales respaldadas por la tecnologia de
            NovaCoin.
          </p>
        </div>

        <div ref={flowRef} style={{ perspective: "1200px" }}>
          <ExchangeFlow />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "1000px" }}
        >
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              desc={service.desc}
              tags={service.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
