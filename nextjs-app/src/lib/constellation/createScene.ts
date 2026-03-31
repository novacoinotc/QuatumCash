import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ACESFilmicToneMapping,
} from "three";
import { CAMERA_FOV, CAMERA_Z, CLEAR_COLOR, MAX_PIXEL_RATIO } from "./constants";
import type { ConstellationScene } from "./types";

export function createConstellationScene(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): ConstellationScene {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    CAMERA_FOV,
    width / height,
    1,
    2000
  );
  camera.position.z = CAMERA_Z;

  const renderer = new WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(CLEAR_COLOR, 1);

  return { scene, camera, renderer };
}

/** Compute visible width/height at a given z-depth for the camera. */
export function getVisibleSize(camera: PerspectiveCamera, depth: number = 0) {
  const cameraZ = camera.position.z;
  const distance = cameraZ - depth;
  const vFov = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFov / 2) * distance;
  const width = height * camera.aspect;
  return { width, height };
}
