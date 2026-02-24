"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SECTION_COLORS: Record<string, string> = {
  inicio: "#0B0D17",
  "sobre-mi": "#0D0F1B",
  estadisticas: "#0E0B19",
  servicios: "#0B0F1B",
  "por-que-elegirme": "#100D1A",
  contacto: "#0B0D17",
};

// Parse hex to [r, g, b]
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")
  );
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  return rgbToHex(
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  );
}

export function useSectionColorShift() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const sectionIds = Object.keys(SECTION_COLORS);
    const triggers: ScrollTrigger[] = [];

    sectionIds.forEach((id, index) => {
      const section = document.getElementById(id);
      if (!section) return;

      const currentColor = hexToRgb(SECTION_COLORS[id]);
      const nextId = sectionIds[index + 1];
      const nextColor = nextId
        ? hexToRgb(SECTION_COLORS[nextId])
        : currentColor;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 2,
        onUpdate: (self) => {
          const color = lerpColor(currentColor, nextColor, self.progress);
          document.documentElement.style.setProperty("--current-bg", color);
        },
      });

      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);
}
