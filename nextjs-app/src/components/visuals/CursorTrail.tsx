"use client";

import { useRef, useEffect } from "react";

const TRAIL_LENGTH = 25;
const GLOW_RADIUS = 150;

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
    let mouseX = -200;
    let mouseY = -200;
    let targetX = -200;
    let targetY = -200;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth follow
      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;

      // Add current position
      trail.unshift({ x: mouseX, y: mouseY, age: 0 });
      if (trail.length > TRAIL_LENGTH) trail.pop();

      // Subtle glow at cursor position
      const glowGradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, GLOW_RADIUS
      );
      glowGradient.addColorStop(0, "rgba(124, 58, 237, 0.03)");
      glowGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.01)");
      glowGradient.addColorStop(1, "rgba(124, 58, 237, 0)");
      ctx.fillStyle = glowGradient;
      ctx.fillRect(
        mouseX - GLOW_RADIUS,
        mouseY - GLOW_RADIUS,
        GLOW_RADIUS * 2,
        GLOW_RADIUS * 2
      );

      // Draw trail with connecting lines
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          const t = i / trail.length;
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        const lineGradient = ctx.createLinearGradient(
          trail[0].x, trail[0].y,
          trail[trail.length - 1].x, trail[trail.length - 1].y
        );
        lineGradient.addColorStop(0, "rgba(124, 58, 237, 0.15)");
        lineGradient.addColorStop(1, "rgba(236, 72, 153, 0)");
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw trail dots
      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const t = i / trail.length;
        const size = (1 - t) * 3.5 + 0.3;
        const alpha = (1 - t) * 0.4;

        const r = Math.round(124 + (236 - 124) * t);
        const g = Math.round(58 + (72 - 58) * t);
        const b = Math.round(237 + (153 - 237) * t);

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Small glow on first few dots
        if (i < 3) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
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
