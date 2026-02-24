"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        end: "top 60%",
        scrub: 1,
      },
    });

    tl.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, ease: "none" }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="section-divider mx-auto my-0 max-w-[var(--container-max)] origin-center"
      aria-hidden="true"
    />
  );
}
