/**
 * Map a tropical ecliptic longitude onto the Human Design wheel → gate + line.
 *
 * The wheel starts at Gate 41 (WHEEL_ORIGIN = 302.0°) and runs in zodiacal order
 * in clean 5.625° gate steps; each gate divides into six 0.9375° lines.
 */

import { WHEEL, WHEEL_ORIGIN, GATE_WIDTH, LINE_WIDTH } from "./data/gates";
import { norm360 } from "./math";

export interface GateLine {
  gate: number;
  line: number; // 1-6
  longitude: number; // the source longitude, [0, 360)
}

/** Longitude → { gate, line }. */
export function gateLineOf(longitude: number): GateLine {
  const lon = norm360(longitude);
  const pos = norm360(lon - WHEEL_ORIGIN);
  const index = Math.floor(pos / GATE_WIDTH); // 0..63
  const gate = WHEEL[index];
  const within = pos - index * GATE_WIDTH;
  const line = Math.min(6, Math.floor(within / LINE_WIDTH) + 1); // 1..6
  return { gate, line, longitude: Number(lon.toFixed(6)) };
}

/** The tropical longitude at which a given gate begins, [0, 360). */
export function gateStartLongitude(gate: number): number {
  const index = WHEEL.indexOf(gate);
  if (index < 0) throw new Error(`Unknown gate: ${gate}`);
  return norm360(WHEEL_ORIGIN + index * GATE_WIDTH);
}
