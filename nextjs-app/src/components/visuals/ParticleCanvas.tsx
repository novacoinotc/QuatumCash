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
  isHub: boolean;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  x: number;
  y: number;
}

const COLORS: [number, number, number][] = [
  [129, 140, 248],
  [167, 139, 250],
  [244, 114, 182],
  [196, 181, 253],
  [100, 200, 255], // cyan/blue accent
];

const CONNECT_DIST_DESKTOP = 180;
const CONNECT_DIST_HUB = 250;
const PARTICLE_DENSITY_DESKTOP = 12000;
const PARTICLE_DENSITY_MOBILE = 30000;
const MAX_PARTICLES_DESKTOP = 70;
const MAX_PARTICLES_MOBILE = 20;
const MAX_PARTICLES_SMALL = 12;
const HUB_RATIO = 0.12;
const NUM_DATA_PACKETS = 6;

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dataPacketsRef = useRef<DataPacket[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const isVisibleRef = useRef(true);
  const frameCountRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const glowMultiplierRef = useRef(2.0);

  const createParticle = useCallback(
    (width: number, height: number, isMobile: boolean, forceHub = false): Particle => {
      const isHub = forceHub || (!isMobile && Math.random() < HUB_RATIO);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHub
          ? Math.random() * 10 + 15 // Hub: 15-25px (was 3-5)
          : Math.random() * (isMobile ? 1.2 : 2) + 0.5,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.25 : isHub ? 0.15 : 0.4),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.25 : isHub ? 0.15 : 0.4),
        opacity: isHub
          ? Math.random() * 0.3 + 0.5 // Hub: 0.5-0.8
          : Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isHub,
      };
    },
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
    const isLowEnd =
      typeof navigator !== "undefined" &&
      "hardwareConcurrency" in navigator &&
      navigator.hardwareConcurrency <= 4;
    const maxParticles = isSmallMobile
      ? MAX_PARTICLES_SMALL
      : isMobile
        ? MAX_PARTICLES_MOBILE
        : MAX_PARTICLES_DESKTOP;
    const particleDensity = isMobile
      ? PARTICLE_DENSITY_MOBILE
      : PARTICLE_DENSITY_DESKTOP;
    const skipConnections = isMobile || isLowEnd;
    const enableConstellation = !isMobile && !isLowEnd;

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

    // Ensure we have hub nodes on desktop (8-10 hubs)
    const hubCount = enableConstellation ? Math.max(8, Math.floor(count * HUB_RATIO)) : 0;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(canvas.width, canvas.height, isMobile, i < hubCount));
    }
    particlesRef.current = particles;

    // Initialize data packets (desktop only)
    const dataPackets: DataPacket[] = [];
    if (enableConstellation && hubCount >= 2) {
      const hubIndices = particles
        .map((p, i) => (p.isHub ? i : -1))
        .filter((i) => i >= 0);

      for (let i = 0; i < NUM_DATA_PACKETS; i++) {
        const fromIdx = hubIndices[Math.floor(Math.random() * hubIndices.length)];
        let toIdx = fromIdx;
        while (toIdx === fromIdx) {
          toIdx = hubIndices[Math.floor(Math.random() * hubIndices.length)];
        }
        dataPackets.push({
          fromIndex: fromIdx,
          toIndex: toIdx,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.003, // Slower: 0.003-0.006 (was 0.005-0.01)
          x: particles[fromIdx].x,
          y: particles[fromIdx].y,
        });
      }
    }
    dataPacketsRef.current = dataPackets;

    // Glow burst: decay from 2.0 to 1.0 over 2 seconds
    glowMultiplierRef.current = 2.0;
    const glowDecayStart = performance.now();

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
          const newHubCount = enableConstellation ? Math.max(8, Math.floor(newCount * HUB_RATIO)) : 0;
          const newParticles: Particle[] = [];
          for (let i = 0; i < newCount; i++) {
            newParticles.push(
              createParticle(canvas.width, canvas.height, isMobile, i < newHubCount)
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
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x -= (dx / dist) * force * 0.5;
          p.y -= (dy / dist) * force * 0.5;
        }
      }

      // Wrap around
      if (p.x < -p.size) p.x = canvas.width + p.size;
      if (p.x > canvas.width + p.size) p.x = -p.size;
      if (p.y < -p.size) p.y = canvas.height + p.size;
      if (p.y > canvas.height + p.size) p.y = -p.size;
    };

    const drawParticle = (p: Particle, glowMult: number) => {
      const effectiveOpacity = p.opacity * glowMult;

      if (p.isHub && enableConstellation) {
        // Pulsating glow ring — BIG and bright
        const pulsePhase = Math.sin(frameCountRef.current * 0.02 + p.x * 0.01) * 0.4 + 0.6;
        const ringRadius = p.size * 4; // 4x radius (was 3x)
        const ringOpacity = 0.3 * pulsePhase * glowMult; // 0.3 (was 0.15)

        // Outer glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringRadius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${ringOpacity * 0.08})`;
        ctx.fill();

        // Main glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${ringOpacity * 0.2})`;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2); // 2x (was 1.5x)
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${Math.min(effectiveOpacity * 0.8, 0.8)})`;
        ctx.fill();

        // Bright center point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(effectiveOpacity * 0.5, 0.5)})`;
        ctx.fill();
      }

      // Core particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.isHub ? p.size : p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${Math.min(effectiveOpacity, 1)})`;
      ctx.fill();
    };

    const connectParticles = () => {
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const bothHub = pts[i].isHub && pts[j].isHub;
          const oneHub = pts[i].isHub || pts[j].isHub;
          const maxDist = (bothHub || oneHub) ? CONNECT_DIST_HUB : CONNECT_DIST_DESKTOP;
          const maxOpacity = bothHub ? 0.35 : oneHub ? 0.2 : 0.08;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * maxOpacity;

            // Hub-to-hub: draw glow line underneath
            if (bothHub) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(167,139,250,${opacity * 0.15})`;
              ctx.lineWidth = 4;
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }

            ctx.beginPath();
            ctx.strokeStyle = `rgba(167,139,250,${opacity})`;
            ctx.lineWidth = bothHub ? 1.5 : 0.5; // 1.5 for hub-to-hub (was 0.8)
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const updateAndDrawDataPackets = () => {
      const pts = particlesRef.current;
      const packets = dataPacketsRef.current;
      const hubIndices = pts
        .map((p, i) => (p.isHub ? i : -1))
        .filter((i) => i >= 0);

      if (hubIndices.length < 2) return;

      for (const packet of packets) {
        const from = pts[packet.fromIndex];
        const to = pts[packet.toIndex];
        if (!from || !to) continue;

        packet.progress += packet.speed;

        // Lerp position
        packet.x = from.x + (to.x - from.x) * packet.progress;
        packet.y = from.y + (to.y - from.y) * packet.progress;

        // Draw glow trail — 15px radius (was 6)
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167,139,250,0.15)";
        ctx.fill();

        // Draw bright dot — 5px (was 2)
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,210,255,0.7)";
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();

        // When arrived, bounce to nearest different hub
        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.fromIndex = packet.toIndex;

          let nearestDist = Infinity;
          let nearestIdx = packet.fromIndex;
          for (const hIdx of hubIndices) {
            if (hIdx === packet.fromIndex) continue;
            const ddx = pts[hIdx].x - pts[packet.fromIndex].x;
            const ddy = pts[hIdx].y - pts[packet.fromIndex].y;
            const d = ddx * ddx + ddy * ddy;
            if (d < nearestDist) {
              nearestDist = d;
              nearestIdx = hIdx;
            }
          }
          packet.toIndex = nearestIdx;
          packet.speed = 0.003 + Math.random() * 0.003;
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

      // Update glow multiplier decay
      const elapsed = performance.now() - glowDecayStart;
      glowMultiplierRef.current = elapsed < 2000
        ? 1 + (1 - elapsed / 2000)
        : 1.0;

      const glowMult = glowMultiplierRef.current;

      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        updateParticle(pts[i]);
        drawParticle(pts[i], glowMult);
      }

      // Draw connections every 2 frames for performance
      if (!skipConnections && frameCountRef.current % 2 === 0) {
        connectParticles();
      }

      // Data packets (desktop only)
      if (enableConstellation) {
        updateAndDrawDataPackets();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Visibility observer
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

    if (!prefersReducedMotion) {
      animate();
    } else {
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        drawParticle(pts[i], 1);
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
