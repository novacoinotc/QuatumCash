"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    // Animate the glow position based on scroll progress through the page
    const tween = gsap.to(el, {
      backgroundPosition: "50% 70%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        backgroundSize: "100% 200%",
        backgroundPosition: "50% 30%",
      }}
      aria-hidden="true"
    />
  );
}
