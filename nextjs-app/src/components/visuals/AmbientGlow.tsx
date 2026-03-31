"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

    // Main glow follows scroll
    const mainTween = gsap.to(el, {
      backgroundPosition: "50% 70%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });

    // Floating orbs — subtle ambient movement
    const orb1Tl = gsap.timeline({ repeat: -1, yoyo: true });
    orb1Tl.to(orb1, {
      x: 60,
      y: -40,
      scale: 1.15,
      duration: 8,
      ease: "sine.inOut",
    }).to(orb1, {
      x: -30,
      y: 30,
      scale: 0.9,
      duration: 10,
      ease: "sine.inOut",
    });

    const orb2Tl = gsap.timeline({ repeat: -1, yoyo: true });
    orb2Tl.to(orb2, {
      x: -50,
      y: 50,
      scale: 1.2,
      duration: 12,
      ease: "sine.inOut",
    }).to(orb2, {
      x: 40,
      y: -20,
      scale: 0.85,
      duration: 9,
      ease: "sine.inOut",
    });

    // Color shift based on scroll section
    const colorTween = gsap.to(el, {
      "--glow-hue": 280,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
      },
    });

    return () => {
      mainTween.scrollTrigger?.kill();
      mainTween.kill();
      colorTween.scrollTrigger?.kill();
      colorTween.kill();
      orb1Tl.kill();
      orb2Tl.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        backgroundSize: "100% 200%",
        backgroundPosition: "50% 30%",
      }}
      aria-hidden="true"
    >
      {/* Floating ambient orbs */}
      <div
        ref={orb1Ref}
        className="absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.03) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
