/**
 * The 9 Human Design centers and the gates that belong to each.
 *
 * A center is the source of truth for gate membership: every one of the 64 gates
 * lives in exactly one center. Channel endpoints and center-definition are both
 * derived from this map, so the gate→center assignment is defined here once.
 */

export const CENTERS = [
  "Head",
  "Ajna",
  "Throat",
  "G",
  "Heart",
  "Sacral",
  "Spleen",
  "SolarPlexus",
  "Root",
] as const;

export type Center = (typeof CENTERS)[number];

/** Human-facing center metadata. */
export interface CenterInfo {
  key: Center;
  name: string; // display name
  kind: "pressure" | "awareness" | "motor" | "manifestation" | "identity";
  motor: boolean;
  gates: number[];
}

/**
 * Motor centers (provide energy): Sacral, Heart/Ego, Solar Plexus, Root.
 * Awareness centers: Ajna, Spleen, Solar Plexus.
 * Pressure centers: Head, Root.
 * The Throat is the center of manifestation/communication; G is identity/direction.
 */
export const CENTER_INFO: Record<Center, CenterInfo> = {
  Head: { key: "Head", name: "Head (Crown)", kind: "pressure", motor: false, gates: [64, 61, 63] },
  Ajna: { key: "Ajna", name: "Ajna", kind: "awareness", motor: false, gates: [47, 24, 4, 17, 43, 11] },
  Throat: {
    key: "Throat",
    name: "Throat",
    kind: "manifestation",
    motor: false,
    gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  },
  G: { key: "G", name: "G (Identity)", kind: "identity", motor: false, gates: [7, 1, 13, 25, 46, 2, 15, 10] },
  Heart: { key: "Heart", name: "Heart (Ego/Will)", kind: "motor", motor: true, gates: [21, 40, 26, 51] },
  Sacral: {
    key: "Sacral",
    name: "Sacral",
    kind: "motor",
    motor: true,
    gates: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  },
  Spleen: {
    key: "Spleen",
    name: "Spleen",
    kind: "awareness",
    motor: false,
    gates: [48, 57, 44, 50, 32, 28, 18],
  },
  SolarPlexus: {
    key: "SolarPlexus",
    name: "Solar Plexus (Emotional)",
    kind: "motor",
    motor: true,
    gates: [6, 37, 22, 36, 30, 55, 49],
  },
  Root: {
    key: "Root",
    name: "Root",
    kind: "pressure",
    motor: true,
    gates: [53, 60, 52, 19, 39, 41, 58, 38, 54],
  },
};

/** Motor centers — used by the Type decision tree. */
export const MOTOR_CENTERS: Center[] = CENTERS.filter((c) => CENTER_INFO[c].motor);

/** Reverse index: gate number → its center. Built once. */
export const GATE_CENTER: Record<number, Center> = (() => {
  const map: Record<number, Center> = {};
  for (const c of CENTERS) for (const g of CENTER_INFO[c].gates) map[g] = c;
  return map;
})();

/** Center a gate belongs to (throws on an unknown gate — guards the data tables). */
export function centerOfGate(gate: number): Center {
  const c = GATE_CENTER[gate];
  if (!c) throw new Error(`Gate ${gate} is not assigned to any center`);
  return c;
}
