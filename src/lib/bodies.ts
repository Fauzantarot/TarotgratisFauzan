/**
 * The 13 bodies Human Design activates, at a given instant, mapped to gate.line.
 *
 * Bodies: Sun, Earth (= Sun + 180°), North Node, South Node (= North Node + 180°),
 * Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.
 *
 * Nodes: Human Design uses the TRUE (osculating) lunar node — computed here from
 * the Moon's instantaneous orbital angular momentum, not the mean-node polynomial.
 */

import * as Astronomy from "astronomy-engine";
import { eclipticLongitude } from "./ephemeris";
import { gateLineOf, type GateLine } from "./wheel";
import { norm360 } from "./math";

/** Display/activation order of the HD bodies. */
export const HD_BODIES = [
  "Sun",
  "Earth",
  "NorthNode",
  "SouthNode",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
] as const;

export type HdBody = (typeof HD_BODIES)[number];

/** Human-facing labels for the bodies (HD uses ☉ Sun, ⊕ Earth, ☊/☋ Nodes …). */
export const BODY_LABEL: Record<HdBody, string> = {
  Sun: "Sun",
  Earth: "Earth",
  NorthNode: "North Node",
  SouthNode: "South Node",
  Moon: "Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto",
};

/**
 * True (osculating) longitude of the Moon's ascending node, of date, in [0, 360).
 *
 * The node line lies along k̂ × ĥ, where ĥ is the Moon's orbital angular momentum
 * (r × v) and k̂ is ecliptic north. We take the Moon's geocentric state vector in
 * the ecliptic-of-date frame and read the ascending-node longitude off it.
 */
export function trueNorthNode(date: Date): number {
  const dtMs = 3_600_000; // ±1 hour, central difference
  const rot = Astronomy.Rotation_EQJ_ECT(date); // EQJ → ecliptic of date
  const before = Astronomy.RotateVector(rot, Astronomy.GeoMoon(new Date(date.getTime() - dtMs)));
  const after = Astronomy.RotateVector(rot, Astronomy.GeoMoon(new Date(date.getTime() + dtMs)));

  const r = { x: (before.x + after.x) / 2, y: (before.y + after.y) / 2, z: (before.z + after.z) / 2 };
  const v = { x: after.x - before.x, y: after.y - before.y, z: after.z - before.z }; // scale irrelevant

  // h = r × v  (orbital angular momentum)
  const h = {
    x: r.y * v.z - r.z * v.y,
    y: r.z * v.x - r.x * v.z,
    z: r.x * v.y - r.y * v.x,
  };
  // Ascending-node direction n = k̂ × h = (−h_y, h_x, 0); Ω = atan2(n_y, n_x).
  return norm360((Math.atan2(h.x, -h.y) * 180) / Math.PI);
}

/** Ecliptic longitude (of date, tropical) of one HD body. */
export function bodyLongitude(body: HdBody, date: Date): number {
  switch (body) {
    case "Sun":
      return eclipticLongitude("Sun", date);
    case "Earth":
      return norm360(eclipticLongitude("Sun", date) + 180);
    case "NorthNode":
      return trueNorthNode(date);
    case "SouthNode":
      return norm360(trueNorthNode(date) + 180);
    case "Moon":
      return eclipticLongitude("Moon", date);
    default:
      return eclipticLongitude(body, date);
  }
}

export interface Activation extends GateLine {
  body: HdBody;
}

/** All 13 body activations (gate.line) at an instant. */
export function activationsAt(date: Date): Activation[] {
  return HD_BODIES.map((body) => ({ body, ...gateLineOf(bodyLongitude(body, date)) }));
}
