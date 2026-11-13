/**
 * The 36 Human Design channels. Each channel is a pair of gates; a channel is
 * "defined" when BOTH of its gates are activated. The two centers a channel
 * connects are derived from the gate→center map (centers.ts) so they can never
 * drift out of sync with the gate assignments.
 */

import { centerOfGate, type Center } from "./centers";

export interface ChannelDef {
  gates: [number, number];
  name: string;
  centers: [Center, Center];
}

const RAW: Array<{ gates: [number, number]; name: string }> = [
  { gates: [1, 8], name: "Inspiration" },
  { gates: [2, 14], name: "The Beat" },
  { gates: [3, 60], name: "Mutation" },
  { gates: [4, 63], name: "Logic" },
  { gates: [5, 15], name: "Rhythm" },
  { gates: [6, 59], name: "Mating" },
  { gates: [7, 31], name: "The Alpha" },
  { gates: [9, 52], name: "Concentration" },
  { gates: [10, 20], name: "Awakening" },
  { gates: [10, 34], name: "Exploration" },
  { gates: [10, 57], name: "Perfected Form" },
  { gates: [11, 56], name: "Curiosity" },
  { gates: [12, 22], name: "Openness" },
  { gates: [13, 33], name: "The Prodigal" },
  { gates: [16, 48], name: "The Wavelength" },
  { gates: [17, 62], name: "Acceptance" },
  { gates: [18, 58], name: "Judgment" },
  { gates: [19, 49], name: "Synthesis" },
  { gates: [20, 34], name: "Charisma" },
  { gates: [20, 57], name: "The Brainwave" },
  { gates: [21, 45], name: "Money" },
  { gates: [23, 43], name: "Structuring" },
  { gates: [24, 61], name: "Awareness" },
  { gates: [25, 51], name: "Initiation" },
  { gates: [26, 44], name: "Surrender" },
  { gates: [27, 50], name: "Preservation" },
  { gates: [28, 38], name: "Struggle" },
  { gates: [29, 46], name: "Discovery" },
  { gates: [30, 41], name: "Recognition" },
  { gates: [32, 54], name: "Transformation" },
  { gates: [34, 57], name: "Power" },
  { gates: [35, 36], name: "Transitoriness" },
  { gates: [37, 40], name: "Community" },
  { gates: [39, 55], name: "Emoting" },
  { gates: [42, 53], name: "Maturation" },
  { gates: [47, 64], name: "Abstraction" },
];

/** All 36 channels, each with its two endpoint centers resolved from the gates. */
export const CHANNELS: ChannelDef[] = RAW.map(({ gates, name }) => {
  const a = centerOfGate(gates[0]);
  const b = centerOfGate(gates[1]);
  return { gates, name, centers: [a, b] };
});

/** Canonical channel key, e.g. "1-8" (smaller gate first) for stable lookups. */
export function channelKey(g1: number, g2: number): string {
  return g1 < g2 ? `${g1}-${g2}` : `${g2}-${g1}`;
}
