"use client";

import { useRef, useEffect } from "react";

const TRAIL_LENGTH = 20;

interface TrailPoint {
  x: number;
  y: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only render on hover-capable devices (desktop)
    const hasHover = window.matchMedia("(hover: hover)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasHover || prefersReduced) {
      canvas.style.display = "none";
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | null = null;
    const trail: TrailPoint[] = [];
    let mouseX = -100;
    let mouseY = -100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => resize();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add current position to trail
      trail.unshift({ x: mouseX, y: mouseY });
      if (trail.length > TRAIL_LENGTH) trail.pop();

      // Draw trail points
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const t = i / trail.length;
        const size = (1 - t) * 3 + 0.5;
        const opacity = (1 - t) * 0.35;

        // Color gradient: purple → pink → transparent
        const r = Math.round(124 + (236 - 124) * t);
        const g = Math.round(58 + (72 - 58) * t);
        const b = Math.round(237 + (153 - 237) * t);

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
