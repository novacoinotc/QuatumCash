"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollProgressOptions {
  /** ScrollTrigger start position (default: "top 80%") */
  start?: string;
  /** ScrollTrigger end position (default: "bottom 20%") */
  end?: string;
  /** Whether to scrub the timeline (true = tied to scroll position) */
  scrub?: number | boolean;
}

/**
 * Creates a GSAP timeline scrubbed by scroll position of a trigger element.
 * Sections can add child animations to this timeline so they advance as user scrolls.
 */
export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  options: ScrollProgressOptions = {}
) {
  const ref = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const { start = "top 80%", end = "bottom 20%", scrub = 1 } = options;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
      },
    });

    timelineRef.current = tl;

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, timeline: timelineRef };
}
