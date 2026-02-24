"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { WHY_ITEMS } from "@/lib/constants";
import { useScrollTextReveal } from "@/hooks/useScrollTextReveal";
import WhyItem from "@/components/ui/WhyItem";

export default function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const headingRef = useScrollTextReveal<HTMLHeadingElement>({
    triggerRef: sectionRef,
    start: 0.05,
    end: 0.25,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const list = listRef.current;
    if (!section || !header || !list) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;

    if (prefersReduced) {
      gsap.set([header, ...Array.from(list.children)], { opacity: 1, x: 0, y: 0 });
      return;
    }

    if (isMobile) {
      // Mobile: simple scrub, NO pin
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 90%",
          end: "bottom 70%",
          scrub: 1,
        },
      });

      headerTl.from(header, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
      });

      const listTl = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top 90%",
          end: "bottom 50%",
          scrub: 1,
        },
      });

      const items = list.children;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const numberEl = item.querySelector(".why-number");

        listTl.from(
          item,
          { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
          i * 0.15
        );

        if (numberEl) {
          listTl.from(
            numberEl,
            { scale: 0.5, opacity: 0, duration: 0.4, ease: "back.out(2)" },
            i * 0.15
          );
        }
      }

      return () => {
        headerTl.scrollTrigger?.kill();
        headerTl.kill();
        listTl.scrollTrigger?.kill();
        listTl.kill();
      };
    }

    // Desktop: pinned fullscreen
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=80vh",
        pin: true,
        anticipatePin: 1,
        scrub: 0.5,
      },
    });

    // Label
    const label = header.querySelector(".why-label");
    if (label) {
      tl.from(label, { opacity: 0, y: 20, duration: 0.1, ease: "power3.out" });
    }

    // Heading reveal handled by hook

    // Items: sequential clipPath wipe + number scale
    const items = list.children;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const numberEl = item.querySelector(".why-number");

      tl.from(
        item,
        {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          x: -50,
          duration: 0.15,
          ease: "power3.out",
        },
        0.3 + i * 0.12
      );

      if (numberEl) {
        tl.from(
          numberEl,
          {
            scale: 0,
            rotate: -45,
            opacity: 0,
            duration: 0.1,
            ease: "back.out(3)",
          },
          0.35 + i * 0.12
        );
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="por-que-elegirme"
      className="section-pinned perspective-section relative"
      style={{ zIndex: 2, backgroundColor: "var(--bg-why)" }}
    >
      {/* Decorative SVGs */}
      <div className="section-overflow-wrapper pointer-events-none absolute inset-0">
        <svg
          className="absolute left-0 top-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          style={{ height: "60px" }}
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60"
            stroke="url(#wave-g)"
            strokeWidth="0.8"
            opacity="0.15"
          >
            <animate
              attributeName="d"
              values="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60;M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60;M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
          <defs>
            <linearGradient id="wave-g" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute left-0 top-0 h-full w-[300px] opacity-60 max-md:hidden"
          viewBox="0 0 300 700"
          fill="none"
        >
          <path
            d="M150,0 L150,100 L80,100 L80,200 L200,200 L200,300 L120,300 L120,400 L180,400 L180,500 L100,500 L100,600 L160,600 L160,700"
            stroke="url(#why-circuit-g)"
            strokeWidth="0.5"
            opacity="0.1"
            strokeDasharray="6 10"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-160"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="80" cy="200" r="3" fill="#7C3AED" opacity="0.2">
            <animate
              attributeName="opacity"
              values="0.15;0.35;0.15"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="200" cy="300" r="3" fill="#EC4899" opacity="0.2">
            <animate
              attributeName="opacity"
              values="0.15;0.35;0.15"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <defs>
            <linearGradient
              id="why-circuit-g"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
              <stop offset="15%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="85%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          className="absolute right-0 top-1/4 h-[400px] w-[250px] opacity-50 max-md:hidden"
          viewBox="0 0 250 400"
          fill="none"
        >
          <polygon points="60,20 90,5 120,20 120,50 90,65 60,50" stroke="#7C3AED" strokeWidth="0.4" opacity="0.06" />
          <polygon points="120,20 150,5 180,20 180,50 150,65 120,50" stroke="#A78BFA" strokeWidth="0.4" opacity="0.05" />
          <polygon points="60,80 90,65 120,80 120,110 90,125 60,110" stroke="#A78BFA" strokeWidth="0.4" opacity="0.06" />
          <polygon points="120,80 150,65 180,80 180,110 150,125 120,110" stroke="#F472B6" strokeWidth="0.4" opacity="0.05" />
          <polygon points="60,140 90,125 120,140 120,170 90,185 60,170" stroke="#EC4899" strokeWidth="0.4" opacity="0.05" />
          <polygon points="120,140 150,125 180,140 180,170 150,185 120,170" stroke="#818CF8" strokeWidth="0.4" opacity="0.06" />
          <polygon points="120,80 150,65 180,80 180,110 150,125 120,110" fill="url(#why-hex-g)" opacity="0">
            <animate attributeName="opacity" values="0;0.08;0" dur="4s" repeatCount="indefinite" />
          </polygon>
          <defs>
            <radialGradient id="why-hex-g">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="section-pinned-inner mx-auto max-w-[var(--container-max)] px-6 py-[var(--section-padding)]">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div ref={headerRef} className="will-change-clip">
            <span className="why-label mb-4 inline-block font-[var(--font-primary)] text-xs font-semibold uppercase tracking-[3px] text-[var(--purple-light)]">
              Por que Elegirme
            </span>
            <h2 ref={headingRef} className="font-[var(--font-primary)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] text-white">
              La diferencia esta en los detalles
            </h2>
          </div>
          <div ref={listRef} className="flex flex-col gap-6">
            {WHY_ITEMS.map((item) => (
              <WhyItem
                key={item.number}
                number={item.number}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
