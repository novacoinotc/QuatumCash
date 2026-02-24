"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ParallaxOptions {
  speed?: number;
  direction?: "y" | "x";
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 768;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isMobile || prefersReduced) return;

    const { speed = 50, direction = "y" } = options;

    const tween = gsap.to(el, {
      [direction]: speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [options.speed, options.direction]);

  return ref;
}
