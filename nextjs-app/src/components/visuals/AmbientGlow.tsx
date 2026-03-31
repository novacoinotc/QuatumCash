"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const orb1 = orb1Ref.current;
    const orb2 = orb2Ref.current;
    if (!el || !orb1 || !orb2) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // Floating orbs — organic ambient movement
    const orb1Tl = gsap.timeline({ repeat: -1, yoyo: true });
    orb1Tl
      .to(orb1, { x: 80, y: -50, scale: 1.15, duration: 10, ease: "sine.inOut" })
      .to(orb1, { x: -40, y: 40, scale: 0.9, duration: 12, ease: "sine.inOut" });

    const orb2Tl = gsap.timeline({ repeat: -1, yoyo: true });
    orb2Tl
      .to(orb2, { x: -60, y: 60, scale: 1.2, duration: 14, ease: "sine.inOut" })
      .to(orb2, { x: 50, y: -30, scale: 0.85, duration: 11, ease: "sine.inOut" });

    return () => {
      orb1Tl.kill();
      orb2Tl.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <div
        ref={orb1Ref}
        className="absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute right-1/4 bottom-1/3 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
