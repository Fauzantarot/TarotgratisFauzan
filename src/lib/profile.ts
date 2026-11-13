/**
 * Profile — the Personality-Sun line over the Design-Sun line (e.g. 1/3), with
 * the cross "angle" (Right Angle / Juxtaposition / Left Angle) it implies.
 */

export interface LineInfo {
  line: number;
  name: string;
  keynote: string;
}

export const LINES: Record<number, LineInfo> = {
  1: { line: 1, name: "Investigator", keynote: "Security through a solid foundation of knowledge." },
  2: { line: 2, name: "Hermit", keynote: "Natural gifts that emerge when others call them out." },
  3: { line: 3, name: "Martyr", keynote: "Wisdom discovered through trial, error, and resilience." },
  4: { line: 4, name: "Opportunist", keynote: "Influence and opportunity through friendship and network." },
  5: { line: 5, name: "Heretic", keynote: "The practical, projected-upon problem solver." },
  6: { line: 6, name: "Role Model", keynote: "A three-phase life maturing into a trustworthy role model." },
};

export type CrossAngle = "Right Angle" | "Juxtaposition" | "Left Angle";

const RIGHT_ANGLE = new Set(["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6"]);
const JUXTAPOSITION = new Set(["4/1"]);
const LEFT_ANGLE = new Set(["5/1", "5/2", "6/2", "6/3"]);

export interface Profile {
  profile: string; // e.g. "1/4"
  personalityLine: number;
  designLine: number;
  angle: CrossAngle;
  lines: { personality: LineInfo; design: LineInfo };
}

/** Build the profile from the Personality-Sun and Design-Sun line numbers. */
export function buildProfile(personalityLine: number, designLine: number): Profile {
  const profile = `${personalityLine}/${designLine}`;
  let angle: CrossAngle;
  if (JUXTAPOSITION.has(profile)) angle = "Juxtaposition";
  else if (LEFT_ANGLE.has(profile)) angle = "Left Angle";
  else if (RIGHT_ANGLE.has(profile)) angle = "Right Angle";
  // Fallback by line geometry for any non-standard pairing.
  else angle = personalityLine <= 3 ? "Right Angle" : "Left Angle";

  return {
    profile,
    personalityLine,
    designLine,
    angle,
    lines: { personality: LINES[personalityLine], design: LINES[designLine] },
  };
}
