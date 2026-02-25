import {
  SphereGeometry,
  InstancedMesh,
  MeshBasicMaterial,
  Color,
  Matrix4,
  Vector3,
  DynamicDrawUsage,
} from "three";
import type { DataPacket3D, DataPacketSystem, ParticleSystem } from "./types";
import {
  NUM_DATA_PACKETS,
  PACKET_HDR_COLOR,
  PACKET_SPEED_MIN,
  PACKET_SPEED_MAX,
} from "./constants";

export function createDataPacketSystem(
  particleSystem: ParticleSystem
): DataPacketSystem | null {
  const { hubIndices, particles } = particleSystem;
  if (hubIndices.length < 2) return null;

  const packets: DataPacket3D[] = [];
  for (let i = 0; i < NUM_DATA_PACKETS; i++) {
    const fromIdx = hubIndices[Math.floor(Math.random() * hubIndices.length)];
    let toIdx = fromIdx;
    while (toIdx === fromIdx) {
      toIdx = hubIndices[Math.floor(Math.random() * hubIndices.length)];
    }
    packets.push({
      fromIndex: fromIdx,
      toIndex: toIdx,
      progress: Math.random(),
      speed:
        PACKET_SPEED_MIN + Math.random() * (PACKET_SPEED_MAX - PACKET_SPEED_MIN),
    });
  }

  const geo = new SphereGeometry(1, 8, 8);
  const mat = new MeshBasicMaterial({
    color: new Color(...PACKET_HDR_COLOR),
    transparent: true,
    opacity: 0.9,
  });

  const mesh = new InstancedMesh(geo, mat, NUM_DATA_PACKETS);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.layers.enable(1); // bloom layer

  // Initialize transforms
  const matrix = new Matrix4();
  const sv = new Vector3(2, 2, 2);
  for (let i = 0; i < packets.length; i++) {
    const p = particles[packets[i].fromIndex];
    matrix.makeTranslation(p.x, p.y, p.z);
    matrix.scale(sv);
    mesh.setMatrixAt(i, matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  return { mesh, material: mat, packets };
}

const _matrix = new Matrix4();
const _sv = new Vector3(2, 2, 2);

export function updateDataPackets(
  packetSystem: DataPacketSystem,
  particleSystem: ParticleSystem
) {
  const { packets, mesh } = packetSystem;
  const { particles, hubIndices } = particleSystem;

  for (let i = 0; i < packets.length; i++) {
    const pkt = packets[i];
    const from = particles[pkt.fromIndex];
    const to = particles[pkt.toIndex];
    if (!from || !to) continue;

    pkt.progress += pkt.speed;

    // Lerp position
    const x = from.x + (to.x - from.x) * pkt.progress;
    const y = from.y + (to.y - from.y) * pkt.progress;
    const z = from.z + (to.z - from.z) * pkt.progress;

    _matrix.makeTranslation(x, y, z);
    _matrix.scale(_sv);
    mesh.setMatrixAt(i, _matrix);

    // When arrived, bounce to nearest different hub
    if (pkt.progress >= 1) {
      pkt.progress = 0;
      pkt.fromIndex = pkt.toIndex;

      let nearestDist = Infinity;
      let nearestIdx = pkt.fromIndex;
      for (const hIdx of hubIndices) {
        if (hIdx === pkt.fromIndex) continue;
        const dx = particles[hIdx].x - particles[pkt.fromIndex].x;
        const dy = particles[hIdx].y - particles[pkt.fromIndex].y;
        const dz = particles[hIdx].z - particles[pkt.fromIndex].z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = hIdx;
        }
      }
      pkt.toIndex = nearestIdx;
      pkt.speed =
        PACKET_SPEED_MIN + Math.random() * (PACKET_SPEED_MAX - PACKET_SPEED_MIN);
    }
  }

  mesh.instanceMatrix.needsUpdate = true;
}
