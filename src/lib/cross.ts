/**
 * Incarnation Cross — the life-purpose theme formed by four gates:
 *   Personality Sun / Personality Earth | Design Sun / Design Earth
 * with an "angle" (Right Angle / Juxtaposition / Left Angle) from the profile and
 * a "quarter" from the Personality Sun's position on the wheel.
 *
 * The cross is fully identified by its four gates + angle. The poetic NAME (e.g.
 * "Cross of Eden") is a label looked up from data/crosses.ts; when a quaternion
 * isn't in that table we return a structural label rather than guess a name.
 */

import { WHEEL } from "./data/gates";
import type { CrossAngle } from "./profile";
import { crossName } from "./data/crosses";

export type Quarter =
  | "Initiation"
  | "Civilization"
  | "Duality"
  | "Mutation";

const QUARTER_THEME: Record<Quarter, string> = {
  Initiation: "Purpose fulfilled through Mind — the quarter of initiation and the search for meaning.",
  Civilization: "Purpose fulfilled through Form — the quarter of civilization, shape, and structure.",
  Duality: "Purpose fulfilled through Bonds — the quarter of duality, relationship, and connection.",
  Mutation: "Purpose fulfilled through Transformation — the quarter of mutation and renewal.",
};

/** Quarter of the Mandala for a Personality-Sun gate (16 gates each). */
export function quarterOf(personalitySunGate: number): Quarter {
  const i = WHEEL.indexOf(personalitySunGate);
  if (i >= 2 && i <= 17) return "Initiation";
  if (i >= 18 && i <= 33) return "Civilization";
  if (i >= 34 && i <= 49) return "Duality";
  return "Mutation"; // indices 50-63 and 0-1
}

export interface IncarnationCross {
  name: string;
  angle: CrossAngle;
  quarter: Quarter;
  quarterTheme: string;
  notation: string; // "36/6 | 11/12"
  gates: {
    personalitySun: number;
    personalityEarth: number;
    designSun: number;
    designEarth: number;
  };
}

export function buildCross(
  personalitySun: number,
  personalityEarth: number,
  designSun: number,
  designEarth: number,
  angle: CrossAngle,
): IncarnationCross {
  const quarter = quarterOf(personalitySun);
  const notation = `${personalitySun}/${personalityEarth} | ${designSun}/${designEarth}`;
  const name = crossName(angle, personalitySun, personalityEarth, designSun, designEarth);
  return {
    name,
    angle,
    quarter,
    quarterTheme: QUARTER_THEME[quarter],
    notation,
    gates: { personalitySun, personalityEarth, designSun, designEarth },
  };
}
