"use client";

import { useRef, useEffect } from "react";
import type { SceneConfig } from "@/lib/constellation/types";
import type { ParticleSystem } from "@/lib/constellation/types";
import type { ConnectionSystem } from "@/lib/constellation/types";
import type { DataPacketSystem } from "@/lib/constellation/types";
import type { PerspectiveCamera, WebGLRenderer, Scene } from "three";
import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

import {
  MAX_PARTICLES_DESKTOP,
  MAX_PARTICLES_MOBILE,
  MAX_PARTICLES_SMALL,
  HUB_COUNT_DESKTOP,
  CAMERA_DRIFT_AMOUNT,
  CAMERA_DRIFT_PERIOD,
} from "@/lib/constellation/constants";

export default function ConstellationScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Detect environment ---
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isLowEnd =
      "hardwareConcurrency" in navigator && navigator.hardwareConcurrency <= 4;
    const enableConstellation = !isMobile && !isLowEnd;

    const particleCount = isSmallMobile
      ? MAX_PARTICLES_SMALL
      : isMobile || isLowEnd
        ? MAX_PARTICLES_MOBILE
        : MAX_PARTICLES_DESKTOP;

    const hubCount = enableConstellation ? HUB_COUNT_DESKTOP : 0;

    const config: SceneConfig = {
      isMobile,
      isSmallMobile,
      isTouch,
      isLowEnd,
      reducedMotion: prefersReducedMotion,
      enableConstellation,
      particleCount,
      hubCount,
    };

    // --- Dynamically import Three.js (keeps SSR safe) ---
    let disposed = false;
    let animationId: number | null = null;
    let renderer: WebGLRenderer | null = null;
    let camera: PerspectiveCamera | null = null;
    let scene: Scene | null = null;
    let composer: EffectComposer | null = null;
    let particleSys: ParticleSystem | null = null;
    let connSys: ConnectionSystem | null = null;
    let packetSys: DataPacketSystem | null = null;
    let frameCount = 0;
    const isVisible = { current: true };
    const mouseWorld = { current: null as { x: number; y: number } | null };

    async function init() {
      // Dynamic imports to avoid SSR issues
      const [
        { createConstellationScene, getVisibleSize },
        { createParticleSystem, updateParticleSystem },
        { createConnectionSystem, updateConnections },
        { createDataPacketSystem, updateDataPackets },
        bloomModule,
      ] = await Promise.all([
        import("@/lib/constellation/createScene"),
        import("@/lib/constellation/particles"),
        import("@/lib/constellation/connections"),
        import("@/lib/constellation/dataPackets"),
        enableConstellation
          ? import("@/lib/constellation/bloom")
          : Promise.resolve(null),
      ]);

      if (disposed || !canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Create scene
      const sceneObj = createConstellationScene(canvas!, width, height);
      renderer = sceneObj.renderer;
      camera = sceneObj.camera;
      scene = sceneObj.scene;

      // Create particles
      particleSys = createParticleSystem(camera, config);
      scene.add(particleSys.points);
      if (particleSys.hubMesh) {
        scene.add(particleSys.hubMesh);
      }

      // Connections (desktop only)
      if (enableConstellation) {
        connSys = createConnectionSystem();
        scene.add(connSys.lines);
      }

      // Data packets (desktop only)
      if (enableConstellation && particleSys) {
        packetSys = createDataPacketSystem(particleSys);
        if (packetSys) {
          scene.add(packetSys.mesh);
        }
      }

      // Bloom (desktop only)
      if (enableConstellation && bloomModule) {
        composer = bloomModule.createBloomComposer(
          renderer,
          scene,
          camera,
          width,
          height
        );
      }

      // Mouse tracking → world coords
      const handleMouseMove = (e: MouseEvent) => {
        if (!camera) return;
        const vis = getVisibleSize(camera, 0);
        mouseWorld.current = {
          x: (e.clientX / window.innerWidth - 0.5) * vis.width,
          y: -(e.clientY / window.innerHeight - 0.5) * vis.height,
        };
      };
      if (!isTouch) {
        window.addEventListener("mousemove", handleMouseMove);
      }

      // Debounced resize
      let resizeTimeout: ReturnType<typeof setTimeout>;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (disposed || !renderer || !camera) return;
          const w = window.innerWidth;
          const h = window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          if (composer) {
            composer.setSize(w, h);
          }
        }, 250);
      };
      window.addEventListener("resize", handleResize, { passive: true });

      // IntersectionObserver for pause
      const observer = new IntersectionObserver(
        (entries) => {
          isVisible.current = entries[0].isIntersecting;
          if (isVisible.current && animationId === null && !prefersReducedMotion) {
            animate();
          }
        },
        { threshold: 0 }
      );
      observer.observe(canvas);

      // --- Animation loop ---
      const startTime = performance.now();

      function animate() {
        if (disposed || !isVisible.current) {
          animationId = null;
          return;
        }

        frameCount++;

        // Update particles
        if (particleSys && camera) {
          updateParticleSystem(
            particleSys,
            camera,
            mouseWorld.current,
            isTouch,
            frameCount
          );
        }

        // Update connections every 2 frames
        if (connSys && particleSys && frameCount % 2 === 0) {
          updateConnections(connSys, particleSys);
        }

        // Update data packets
        if (packetSys && particleSys) {
          updateDataPackets(packetSys, particleSys);
        }

        // Camera drift (subtle breathing effect)
        if (camera && !isMobile) {
          const elapsed = (performance.now() - startTime) / 1000;
          camera.position.x =
            Math.sin(elapsed / CAMERA_DRIFT_PERIOD * Math.PI * 2) *
            CAMERA_DRIFT_AMOUNT;
          camera.position.y =
            Math.cos(elapsed / CAMERA_DRIFT_PERIOD * Math.PI * 2 * 0.7) *
            CAMERA_DRIFT_AMOUNT * 0.5;
        }

        // Render
        if (composer) {
          composer.render();
        } else if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }

        animationId = requestAnimationFrame(animate);
      }

      // --- Start ---
      if (prefersReducedMotion) {
        // Static single-frame render
        if (particleSys && camera) {
          updateParticleSystem(particleSys, camera, null, true, 0);
        }
        if (connSys && particleSys) {
          updateConnections(connSys, particleSys);
        }
        if (composer) {
          composer.render();
        } else if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      } else {
        animate();
      }

      // --- Cleanup function stored for disposal ---
      cleanupRef.current = () => {
        disposed = true;
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
        }
        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", handleResize);
        if (!isTouch) {
          window.removeEventListener("mousemove", handleMouseMove);
        }
        observer.disconnect();

        // Dispose GPU resources
        particleSys?.points.geometry.dispose();
        (particleSys?.points.material as import("three").Material)?.dispose();
        particleSys?.hubMesh?.geometry.dispose();
        particleSys?.hubMaterial?.dispose();
        connSys?.lines.geometry.dispose();
        connSys?.material.dispose();
        packetSys?.mesh.geometry.dispose();
        packetSys?.material.dispose();
        composer?.dispose();
        renderer?.dispose();
      };
    }

    const cleanupRef = { current: () => {} };
    init();

    return () => {
      cleanupRef.current();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
