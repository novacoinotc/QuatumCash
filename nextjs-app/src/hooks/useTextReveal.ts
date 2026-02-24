"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function useTextReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 768;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    if (isMobile) {
      gsap.set(el, { opacity: 0, y: 20 });
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    // Desktop: word-by-word reveal
    const text = el.textContent || "";
    const words = text.split(/\s+/).filter(Boolean);

    el.innerHTML = words
      .map(
        (word) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span style="display:inline-block;transform:translateY(100%);opacity:0;">${word}</span></span>`
      )
      .join(" ");

    const innerSpans = el.querySelectorAll(
      "span > span"
    ) as NodeListOf<HTMLSpanElement>;

    const tween = gsap.to(innerSpans, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = text;
    };
  }, []);

  return ref;
}
