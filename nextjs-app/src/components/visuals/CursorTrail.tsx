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

    const hasHover = window.matchMedia("(hover: hover)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      mouseX += (targetX - mouseX) * 0.12;
      mouseY += (targetY - mouseY) * 0.12;

      trail.unshift({ x: mouseX, y: mouseY });
      if (trail.length > TRAIL_LENGTH) trail.pop();

      // Subtle glow
      const glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
      glow.addColorStop(0, "rgba(0, 240, 255, 0.02)");
      glow.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(mouseX - 120, mouseY - 120, 240, 240);

      // Trail line
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        const grad = ctx.createLinearGradient(
          trail[0].x, trail[0].y,
          trail[trail.length - 1].x, trail[trail.length - 1].y
        );
        grad.addColorStop(0, "rgba(0, 240, 255, 0.12)");
        grad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Trail dots
      for (let i = 0; i < trail.length; i++) {
        const t = i / trail.length;
        const size = (1 - t) * 3 + 0.3;
        const alpha = (1 - t) * 0.35;

        // Cyan → violet gradient
        const r = Math.round(0 + (139 - 0) * t);
        const g = Math.round(240 + (92 - 240) * t);
        const b = Math.round(255 + (246 - 255) * t);

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
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
