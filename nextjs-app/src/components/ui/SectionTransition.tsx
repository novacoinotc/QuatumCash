"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

interface SectionTransitionProps {
  /** Which clip-path reveal variant to use */
  variant?: "top" | "frame" | "curtain";
}

const CLIP_VARIANTS = {
  top: {
    from: "inset(0 0 100% 0)",
    to: "inset(0 0 0% 0)",
  },
  frame: {
    from: "inset(5% 5% 5% 5% round 24px)",
    to: "inset(0 0 0 0)",
  },
  curtain: {
    from: "inset(0 50% 0 50%)",
    to: "inset(0 0% 0 0%)",
  },
};

export default function SectionTransition({
  variant = "top",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

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

    // On mobile, simple opacity transition
    if (isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "top 60%",
          scrub: 1,
        },
      });

      tl.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "none" }
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }

    // Desktop: clip-path reveal
    const clip = CLIP_VARIANTS[variant];
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        end: "top 50%",
        scrub: 1,
      },
    });

    tl.fromTo(
      el,
      { clipPath: clip.from, opacity: 0.3 },
      { clipPath: clip.to, opacity: 1, ease: "none" }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [variant]);

  return (
    <div
      ref={ref}
      className="will-change-clip pointer-events-none h-16 md:h-24"
      aria-hidden="true"
    />
  );
}
