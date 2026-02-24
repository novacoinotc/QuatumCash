"use client";

import { useRef, useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollTextRevealOptions {
  /** The ScrollTrigger trigger element (usually the pinned section) */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Where within the pin timeline to start reveal (0-1) */
  start?: number;
  /** Where within the pin timeline to end reveal (0-1) */
  end?: number;
}

export function useScrollTextReveal<T extends HTMLElement>(
  options: ScrollTextRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const originalHTMLRef = useRef<string>("");

  const { triggerRef, start = 0, end = 0.4 } = options;

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

    // Mobile: no split, handled by section animation
    if (isMobile) return;

    // Save original HTML for cleanup
    originalHTMLRef.current = el.innerHTML;

    // Extract text content while preserving structure
    const textContent = el.textContent || "";
    const words = textContent.split(/\s+/).filter(Boolean);

    // Rebuild innerHTML with word spans
    // Walk through original HTML and wrap each text word
    let html = "";
    words.forEach((word, i) => {
      html +=
        `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:4px;">` +
        `<span class="scroll-word" style="display:inline-block;transform:translateY(110%) rotateX(-60deg);opacity:0;">${word}</span>` +
        `</span>`;
      if (i < words.length - 1) html += " ";
    });

    el.innerHTML = html;

    const wordSpans = el.querySelectorAll(
      ".scroll-word"
    ) as NodeListOf<HTMLSpanElement>;

    // Create scrub timeline
    const trigger = triggerRef?.current || el.closest("section") || el;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
    });

    // Animate words within the start-end range of the pin
    const totalDuration = 1;
    const revealStart = totalDuration * start;
    const revealEnd = totalDuration * end;
    const revealDuration = revealEnd - revealStart;
    const perWord = revealDuration / Math.max(wordSpans.length, 1);

    wordSpans.forEach((word, i) => {
      tl.to(
        word,
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: perWord,
          ease: "power2.out",
        },
        revealStart + i * perWord * 0.6
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      if (originalHTMLRef.current) {
        el.innerHTML = originalHTMLRef.current;
      }
    };
  }, [triggerRef, start, end]);

  return ref;
}
