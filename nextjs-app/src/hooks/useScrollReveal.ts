"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 768;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const {
      y = isMobile ? 20 : 40,
      x = 0,
      duration = isMobile ? 0.6 : 0.8,
      delay = 0,
      stagger = isMobile ? 0.05 : 0.1,
      once = true,
    } = options;

    if (prefersReduced) {
      gsap.set(el.children.length > 0 ? el.children : el, {
        opacity: 1,
        y: 0,
        x: 0,
      });
      return;
    }

    const targets = el.children.length > 0 ? el.children : el;

    gsap.set(targets, { opacity: 0, y, x });

    const tl = gsap.to(targets, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: isMobile ? "top 90%" : "top 80%",
        toggleActions: once ? "play none none none" : "play none none reverse",
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [options.y, options.x, options.duration, options.delay, options.stagger, options.once]);

  return ref;
}
