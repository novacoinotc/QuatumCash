import {
  BufferGeometry,
  Float32BufferAttribute,
  LineSegments,
  LineBasicMaterial,
  AdditiveBlending,
  DynamicDrawUsage,
} from "three";
import type { ConnectionSystem, ParticleSystem } from "./types";
import {
  MAX_CONNECTIONS,
  CONNECT_DIST_REGULAR,
  CONNECT_DIST_HUB,
  LINE_COLOR,
} from "./constants";

export function createConnectionSystem(): ConnectionSystem {
  // Pre-allocate buffers for max connections (each line = 2 vertices * 3 floats)
  const maxVerts = MAX_CONNECTIONS * 2;
  const positions = new Float32Array(maxVerts * 3);
  const colors = new Float32Array(maxVerts * 3);

  const geometry = new BufferGeometry();
  const posAttr = new Float32BufferAttribute(positions, 3);
  posAttr.usage = DynamicDrawUsage;
  geometry.setAttribute("position", posAttr);

  const colAttr = new Float32BufferAttribute(colors, 3);
  colAttr.usage = DynamicDrawUsage;
  geometry.setAttribute("color", colAttr);

  geometry.setDrawRange(0, 0); // nothing visible initially

  const material = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 1.0,
  });

  const lines = new LineSegments(geometry, material);

  return { lines, material, maxConnections: MAX_CONNECTIONS };
}

export function updateConnections(
  connSystem: ConnectionSystem,
  particleSystem: ParticleSystem
) {
  const { particles } = particleSystem;
  const { lines, maxConnections } = connSystem;
  const posArray = lines.geometry.getAttribute("position").array as Float32Array;
  const colArray = lines.geometry.getAttribute("color").array as Float32Array;

  let lineCount = 0;

  for (let i = 0; i < particles.length && lineCount < maxConnections; i++) {
    for (let j = i + 1; j < particles.length && lineCount < maxConnections; j++) {
      const a = particles[i];
      const b = particles[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const bothHub = a.isHub && b.isHub;
      const oneHub = a.isHub || b.isHub;
      const maxDist = bothHub || oneHub ? CONNECT_DIST_HUB : CONNECT_DIST_REGULAR;

      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * (bothHub ? 0.4 : oneHub ? 0.25 : 0.1);
        const idx = lineCount * 6; // 2 verts * 3 floats

        // Vertex A
        posArray[idx] = a.x;
        posArray[idx + 1] = a.y;
        posArray[idx + 2] = a.z;

        // Vertex B
        posArray[idx + 3] = b.x;
        posArray[idx + 4] = b.y;
        posArray[idx + 5] = b.z;

        // Colors (same for both verts, opacity baked into color intensity)
        const r = LINE_COLOR[0] * opacity;
        const g = LINE_COLOR[1] * opacity;
        const bCol = LINE_COLOR[2] * opacity;

        colArray[idx] = r;
        colArray[idx + 1] = g;
        colArray[idx + 2] = bCol;
        colArray[idx + 3] = r;
        colArray[idx + 4] = g;
        colArray[idx + 5] = bCol;

        lineCount++;
      }
    }
  }

  lines.geometry.getAttribute("position").needsUpdate = true;
  lines.geometry.getAttribute("color").needsUpdate = true;
  lines.geometry.setDrawRange(0, lineCount * 2);
}
