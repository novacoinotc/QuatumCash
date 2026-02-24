"use client";

import { useRef, useEffect } from "react";

/**
 * Splits heading text into word <span>s ready for GSAP animation.
 * Does NOT create its own ScrollTrigger — the parent component
 * adds `.scroll-word` elements to its own pin timeline.
 *
 * Returns a ref to attach to the heading element.
 */
export function useScrollTextReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const originalHTMLRef = useRef<string>("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isMobile = window.innerWidth <= 768;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Mobile / reduced motion: don't split
    if (isMobile || prefersReduced) return;

    // Save original HTML for cleanup
    originalHTMLRef.current = el.innerHTML;

    const textContent = el.textContent || "";
    const words = textContent.split(/\s+/).filter(Boolean);

    let html = "";
    words.forEach((word, i) => {
      html +=
        `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:4px;">` +
        `<span class="scroll-word" style="display:inline-block;transform:translateY(110%);opacity:0;">${word}</span>` +
        `</span>`;
      if (i < words.length - 1) html += " ";
    });

    el.innerHTML = html;

    return () => {
      if (originalHTMLRef.current) {
        el.innerHTML = originalHTMLRef.current;
      }
    };
  }, []);

  return ref;
}
