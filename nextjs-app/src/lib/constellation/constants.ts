// Particle colors (normalized 0-1 for Three.js)
export const COLORS: [number, number, number][] = [
  [129 / 255, 140 / 255, 248 / 255], // Indigo
  [167 / 255, 139 / 255, 250 / 255], // Purple
  [244 / 255, 114 / 255, 182 / 255], // Pink
  [196 / 255, 181 / 255, 253 / 255], // Light Purple
  [100 / 255, 200 / 255, 255 / 255], // Cyan/Blue
];

// Particle counts per tier
export const MAX_PARTICLES_DESKTOP = 60;
export const MAX_PARTICLES_MOBILE = 20;
export const MAX_PARTICLES_SMALL = 12;

export const HUB_COUNT_DESKTOP = 6;
export const NUM_DATA_PACKETS = 4;

// 3D space dimensions
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 500;
export const WORLD_DEPTH = 200; // z: -100 to +100

// Camera
export const CAMERA_FOV = 60;
export const CAMERA_Z = 500;

// Connection distances (world units)
export const CONNECT_DIST_REGULAR = 80;
export const CONNECT_DIST_HUB = 120;
export const MAX_CONNECTIONS = 200;

// Mouse repulsion (world units)
export const MOUSE_REPULSION_RADIUS = 80;
export const MOUSE_REPULSION_FORCE = 0.5;

// Bloom parameters
export const BLOOM_STRENGTH = 1.5;
export const BLOOM_RADIUS = 0.4;
export const BLOOM_THRESHOLD = 0.2;

// HDR colors for bloom (values > 1.0 trigger bloom)
export const HUB_HDR_COLOR = [2.0, 1.5, 3.0] as const;
export const PACKET_HDR_COLOR = [2.5, 2.0, 3.5] as const;

// Connection line color (normal, won't bloom)
export const LINE_COLOR: [number, number, number] = [167 / 255, 139 / 255, 250 / 255];

// Particle speed ranges
export const SPEED_DESKTOP = 0.3;
export const SPEED_MOBILE = 0.15;
export const SPEED_HUB = 0.15;

// Hub pulse
export const HUB_PULSE_SPEED = 0.03;
export const HUB_SIZE_MIN = 3;
export const HUB_SIZE_MAX = 5;

// Packet speed
export const PACKET_SPEED_MIN = 0.003;
export const PACKET_SPEED_MAX = 0.007;

// Camera drift
export const CAMERA_DRIFT_AMOUNT = 2;
export const CAMERA_DRIFT_PERIOD = 15; // seconds

// Clear color (matches CSS --bg)
export const CLEAR_COLOR = 0x06060b;

// Renderer
export const MAX_PIXEL_RATIO = 2;
