import type {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Points,
  InstancedMesh,
  LineSegments,
  ShaderMaterial,
  LineBasicMaterial,
  MeshBasicMaterial,
} from "three";

export interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  color: [number, number, number];
  isHub: boolean;
}

export interface DataPacket3D {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export interface SceneConfig {
  isMobile: boolean;
  isSmallMobile: boolean;
  isTouch: boolean;
  isLowEnd: boolean;
  reducedMotion: boolean;
  enableConstellation: boolean;
  particleCount: number;
  hubCount: number;
}

export interface ConstellationScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
}

export interface ParticleSystem {
  points: Points;
  material: ShaderMaterial;
  particles: Particle3D[];
  hubMesh: InstancedMesh | null;
  hubMaterial: MeshBasicMaterial | null;
  hubIndices: number[];
}

export interface ConnectionSystem {
  lines: LineSegments;
  material: LineBasicMaterial;
  maxConnections: number;
}

export interface DataPacketSystem {
  mesh: InstancedMesh;
  material: MeshBasicMaterial;
  packets: DataPacket3D[];
}
