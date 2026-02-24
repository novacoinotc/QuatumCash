"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SplitTextOptions {
  mode?: "letter" | "word";
  /** Stagger between characters/words in seconds */
  stagger?: number;
  /** Total duration of each char/word animation */
  duration?: number;
  /** Delay before starting */
  delay?: number;
}

export function useSplitTextReveal<T extends HTMLElement>(
  options: SplitTextOptions = {}
) {
  const ref = useRef<T>(null);
  const originalTextRef = useRef<string>("");

  const {
    mode = "letter",
    stagger = 0.025,
    duration = 0.6,
    delay = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const isMobile = window.innerWidth <= 768;

    // Mobile: simple fade+y, no splitting
    if (isMobile) {
      gsap.set(el, { opacity: 0, y: 20 });
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: "power3.out",
      });
      return () => {
        tween.kill();
      };
    }

    // Desktop: split text into individual spans
    const text = el.textContent || "";
    originalTextRef.current = text;

    let html = "";
    if (mode === "letter") {
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === " ") {
          html += " ";
        } else {
          html += `<span style="display:inline-block;overflow:hidden;perspective:600px;vertical-align:top;"><span class="split-char" style="display:inline-block;opacity:0;transform:translateY(80px) rotateX(-90deg) scale(0.5);">${char}</span></span>`;
        }
      }
    } else {
      // word mode
      const words = text.split(/\s+/).filter(Boolean);
      html = words
        .map(
          (word) =>
            `<span style="display:inline-block;overflow:hidden;perspective:600px;vertical-align:top;"><span class="split-char" style="display:inline-block;opacity:0;transform:translateY(80px) rotateX(-90deg) scale(0.5);">${word}</span></span>`
        )
        .join(" ");
    }

    el.innerHTML = html;

    const chars = el.querySelectorAll(".split-char") as NodeListOf<HTMLSpanElement>;

    const tween = gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration,
      delay,
      stagger,
      ease: "back.out(1.5)",
    });

    return () => {
      tween.kill();
      el.textContent = originalTextRef.current;
    };
  }, [mode, stagger, duration, delay]);

  return ref;
}
