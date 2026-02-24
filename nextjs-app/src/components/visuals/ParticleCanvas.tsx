"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: [number, number, number];
}

const COLORS: [number, number, number][] = [
  [129, 140, 248],
  [167, 139, 250],
  [244, 114, 182],
  [196, 181, 253],
];

const CONNECT_DIST_DESKTOP = 150;
const PARTICLE_DENSITY_DESKTOP = 12000;
const PARTICLE_DENSITY_MOBILE = 30000;
const MAX_PARTICLES_DESKTOP = 100;
const MAX_PARTICLES_MOBILE = 20;
const MAX_PARTICLES_SMALL = 12;

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const isVisibleRef = useRef(true);
  const frameCountRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const createParticle = useCallback(
    (width: number, height: number, isMobile: boolean): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (isMobile ? 1.2 : 1.5) + 0.5,
      speedX: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
      speedY: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
      opacity: Math.random() * 0.4 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    reducedMotionRef.current = prefersReducedMotion;

    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const maxParticles = isSmallMobile
      ? MAX_PARTICLES_SMALL
      : isMobile
        ? MAX_PARTICLES_MOBILE
        : MAX_PARTICLES_DESKTOP;
    const particleDensity = isMobile
      ? PARTICLE_DENSITY_MOBILE
      : PARTICLE_DENSITY_DESKTOP;
    const skipConnections = isMobile;

    // Sizing
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    // Initial particles
    const count = Math.min(
      Math.floor((canvas.width * canvas.height) / particleDensity),
      maxParticles
    );
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(canvas.width, canvas.height, isMobile));
    }
    particlesRef.current = particles;

    // Debounced resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        const newCount = Math.min(
          Math.floor((canvas.width * canvas.height) / particleDensity),
          maxParticles
        );
        if (Math.abs(newCount - particlesRef.current.length) > 5) {
          const newParticles: Particle[] = [];
          for (let i = 0; i < newCount; i++) {
            newParticles.push(
              createParticle(canvas.width, canvas.height, isMobile)
            );
          }
          particlesRef.current = newParticles;
        }
      }, 250);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });

    // Mouse tracking (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Drawing helpers
    const updateParticle = (p: Particle) => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Mouse interaction (desktop only)
      if (!isTouch && mouseRef.current.x !== null) {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y! - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 0.5;
          p.y -= (dy / dist) * force * 0.5;
        }
      }

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    };

    const drawParticle = (p: Particle) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.opacity})`;
      ctx.fill();
    };

    const connectParticles = () => {
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST_DESKTOP) {
            const opacity = (1 - dist / CONNECT_DIST_DESKTOP) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      if (!isVisibleRef.current) {
        animationIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCountRef.current++;

      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        updateParticle(pts[i]);
        drawParticle(pts[i]);
      }

      if (!skipConnections) {
        if (!isMobile || frameCountRef.current % 2 === 0) {
          connectParticles();
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Visibility observer - pause canvas when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
        if (isVisibleRef.current && !animationIdRef.current && !prefersReducedMotion) {
          animate();
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Start animation or draw static frame
    if (!prefersReducedMotion) {
      animate();
    } else {
      // Static draw for reduced motion
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        drawParticle(pts[i]);
      }
      if (!skipConnections) {
        connectParticles();
      }
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      observer.disconnect();
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
