import {
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  SphereGeometry,
  InstancedMesh,
  MeshBasicMaterial,
  Color,
  Matrix4,
  Vector3,
  DynamicDrawUsage,
} from "three";
import type { Particle3D, ParticleSystem, SceneConfig } from "./types";
import {
  COLORS,
  WORLD_DEPTH,
  HUB_HDR_COLOR,
  SPEED_DESKTOP,
  SPEED_MOBILE,
  SPEED_HUB,
  HUB_SIZE_MIN,
  HUB_SIZE_MAX,
} from "./constants";
import { getVisibleSize } from "./createScene";
import type { PerspectiveCamera } from "three";

function createParticle3D(
  visW: number,
  visH: number,
  isMobile: boolean,
  isHub: boolean
): Particle3D {
  const speed = isHub ? SPEED_HUB : isMobile ? SPEED_MOBILE : SPEED_DESKTOP;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x: (Math.random() - 0.5) * visW,
    y: (Math.random() - 0.5) * visH,
    z: (Math.random() - 0.5) * WORLD_DEPTH,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    vz: (Math.random() - 0.5) * speed * 0.3,
    size: isHub
      ? Math.random() * (HUB_SIZE_MAX - HUB_SIZE_MIN) + HUB_SIZE_MIN
      : Math.random() * (isMobile ? 2.0 : 3.0) + 1.0,
    opacity: isHub
      ? Math.random() * 0.3 + 0.5
      : Math.random() * 0.4 + 0.2,
    color,
    isHub,
  };
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vOpacity;
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

export function createParticleSystem(
  camera: PerspectiveCamera,
  config: SceneConfig
): ParticleSystem {
  const { width: visW, height: visH } = getVisibleSize(camera, 0);
  const particles: Particle3D[] = [];

  // Create particles — hubs first
  for (let i = 0; i < config.particleCount; i++) {
    const isHub = i < config.hubCount;
    particles.push(createParticle3D(visW, visH, config.isMobile, isHub));
  }

  const count = particles.length;

  // Build Points geometry
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const p = particles[i];
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    colors[i * 3] = p.color[0];
    colors[i * 3 + 1] = p.color[1];
    colors[i * 3 + 2] = p.color[2];
    sizes[i] = p.isHub ? 0 : p.size; // hubs rendered as InstancedMesh
    opacities[i] = p.isHub ? 0 : p.opacity;
  }

  const geometry = new BufferGeometry();
  const posAttr = new Float32BufferAttribute(positions, 3);
  posAttr.usage = DynamicDrawUsage;
  geometry.setAttribute("position", posAttr);

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

  const sizeAttr = new Float32BufferAttribute(sizes, 1);
  sizeAttr.usage = DynamicDrawUsage;
  geometry.setAttribute("aSize", sizeAttr);

  const opacAttr = new Float32BufferAttribute(opacities, 1);
  opacAttr.usage = DynamicDrawUsage;
  geometry.setAttribute("aOpacity", opacAttr);

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  const points = new Points(geometry, material);

  // Hub InstancedMesh (desktop only)
  let hubMesh: InstancedMesh | null = null;
  let hubMaterial: MeshBasicMaterial | null = null;
  const hubIndices: number[] = [];

  if (config.hubCount > 0) {
    const hubGeo = new SphereGeometry(1, 16, 16);
    hubMaterial = new MeshBasicMaterial({
      color: new Color(...HUB_HDR_COLOR),
      transparent: true,
      opacity: 0.8,
    });
    hubMesh = new InstancedMesh(hubGeo, hubMaterial, config.hubCount);
    hubMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    hubMesh.layers.enable(1); // bloom layer

    const matrix = new Matrix4();
    const scaleVec = new Vector3();
    for (let i = 0; i < config.hubCount; i++) {
      hubIndices.push(i);
      const p = particles[i];
      matrix.makeTranslation(p.x, p.y, p.z);
      scaleVec.set(p.size, p.size, p.size);
      matrix.scale(scaleVec);
      hubMesh.setMatrixAt(i, matrix);
    }
    hubMesh.instanceMatrix.needsUpdate = true;
  }

  return { points, material, particles, hubMesh, hubMaterial, hubIndices };
}

const _matrix = new Matrix4();
const _scaleVec = new Vector3();

export function updateParticleSystem(
  system: ParticleSystem,
  camera: PerspectiveCamera,
  mouseWorld: { x: number; y: number } | null,
  isTouch: boolean,
  frameCount: number
) {
  const { particles, points, hubMesh } = system;
  const { width: visW, height: visH } = getVisibleSize(camera, 0);
  const halfW = visW / 2;
  const halfH = visH / 2;
  const halfD = WORLD_DEPTH / 2;

  const posAttr = points.geometry.getAttribute("position");
  const posArray = posAttr.array as Float32Array;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    // Mouse repulsion (desktop only, non-hubs get pushed more)
    if (!isTouch && mouseWorld) {
      const dx = mouseWorld.x - p.x;
      const dy = mouseWorld.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80 * 0.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }
    }

    // Wrap around
    if (p.x < -halfW) p.x = halfW;
    if (p.x > halfW) p.x = -halfW;
    if (p.y < -halfH) p.y = halfH;
    if (p.y > halfH) p.y = -halfH;
    if (p.z < -halfD) p.z = halfD;
    if (p.z > halfD) p.z = -halfD;

    // Update buffer
    posArray[i * 3] = p.x;
    posArray[i * 3 + 1] = p.y;
    posArray[i * 3 + 2] = p.z;
  }
  posAttr.needsUpdate = true;

  // Update hub instances
  if (hubMesh) {
    for (let hi = 0; hi < system.hubIndices.length; hi++) {
      const idx = system.hubIndices[hi];
      const p = particles[idx];
      const pulse = Math.sin(frameCount * 0.03 + idx) * 0.3 + 1.0;
      const s = p.size * pulse;
      _matrix.makeTranslation(p.x, p.y, p.z);
      _scaleVec.set(s, s, s);
      _matrix.scale(_scaleVec);
      hubMesh.setMatrixAt(hi, _matrix);
    }
    hubMesh.instanceMatrix.needsUpdate = true;
  }
}
