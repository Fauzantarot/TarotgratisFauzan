/**
 * Incarnation Cross names, keyed by the Personality-Sun gate and the cross angle.
 *
 * Human Design names a cross by its Personality-Sun gate together with its angle
 * (Right Angle / Juxtaposition / Left Angle) — 64 gates × 3 angles = 192 crosses.
 * Theme names compiled from published cross indexes (e.g. loveyourhumandesign.com,
 * ahumandesign.com); the variation-number suffixes ("Eden 3") are dropped so the
 * canonical theme remains (Einstein → "Right Angle Cross of Eden").
 */

import type { CrossAngle } from "../profile";

interface CrossThemes {
  ra: string; // Right Angle
  jx: string; // Juxtaposition
  la: string; // Left Angle
}

const THEMES: Record<number, CrossThemes> = {
  1: { ra: "Sphinx", jx: "Self-Expression", la: "Defiance" },
  2: { ra: "Sphinx", jx: "Driver", la: "Defiance" },
  3: { ra: "Laws", jx: "Mutation", la: "Wishes" },
  4: { ra: "Explanation", jx: "Formulization", la: "Revolution" },
  5: { ra: "Consciousness", jx: "Habits", la: "Separation" },
  6: { ra: "Eden", jx: "Conflict", la: "Plane" },
  7: { ra: "Sphinx", jx: "Interaction", la: "Masks" },
  8: { ra: "Contagion", jx: "Contribution", la: "Uncertainty" },
  9: { ra: "Planning", jx: "Focus", la: "Identification" },
  10: { ra: "Vessel of Love", jx: "Behavior", la: "Prevention" },
  11: { ra: "Eden", jx: "Ideas", la: "Education" },
  12: { ra: "Eden", jx: "Articulation", la: "Education" },
  13: { ra: "Sphinx", jx: "Listening", la: "Masks" },
  14: { ra: "Contagion", jx: "Empowering", la: "Uncertainty" },
  15: { ra: "Vessel of Love", jx: "Extremes", la: "Prevention" },
  16: { ra: "Planning", jx: "Experimentation", la: "Identification" },
  17: { ra: "Service", jx: "Opinions", la: "Upheaval" },
  18: { ra: "Service", jx: "Correction", la: "Upheaval" },
  19: { ra: "Four Ways", jx: "Need", la: "Refinement" },
  20: { ra: "Sleeping Phoenix", jx: "Now", la: "Duality" },
  21: { ra: "Tension", jx: "Control", la: "Endeavour" },
  22: { ra: "Rulership", jx: "Grace", la: "Informing" },
  23: { ra: "Explanation", jx: "Assimilation", la: "Dedication" },
  24: { ra: "Four Ways", jx: "Rationalization", la: "Incarnation" },
  25: { ra: "Vessel of Love", jx: "Innocence", la: "Healing" },
  26: { ra: "Rulership", jx: "Trickster", la: "Confrontation" },
  27: { ra: "Unexpected", jx: "Caring", la: "Alignment" },
  28: { ra: "Unexpected", jx: "Risks", la: "Alignment" },
  29: { ra: "Contagion", jx: "Commitment", la: "Industry" },
  30: { ra: "Contagion", jx: "Fates", la: "Industry" },
  31: { ra: "Unexpected", jx: "Influence", la: "Alpha" },
  32: { ra: "Maya", jx: "Conservation", la: "Limitation" },
  33: { ra: "Four Ways", jx: "Retreat", la: "Refinement" },
  34: { ra: "Sleeping Phoenix", jx: "Power", la: "Duality" },
  35: { ra: "Consciousness", jx: "Experience", la: "Separation" },
  36: { ra: "Eden", jx: "Crisis", la: "Plane" },
  37: { ra: "Planning", jx: "Bargains", la: "Migration" },
  38: { ra: "Tension", jx: "Opposition", la: "Individualism" },
  39: { ra: "Tension", jx: "Provocation", la: "Individualism" },
  40: { ra: "Planning", jx: "Denial", la: "Migration" },
  41: { ra: "Unexpected", jx: "Fantasy", la: "Alpha" },
  42: { ra: "Maya", jx: "Completion", la: "Limitation" },
  43: { ra: "Explanation", jx: "Insight", la: "Dedication" },
  44: { ra: "Four Ways", jx: "Alertness", la: "Incarnation" },
  45: { ra: "Rulership", jx: "Possession", la: "Confrontation" },
  46: { ra: "Vessel of Love", jx: "Serendipity", la: "Healing" },
  47: { ra: "Rulership", jx: "Oppression", la: "Informing" },
  48: { ra: "Tension", jx: "Depth", la: "Endeavour" },
  49: { ra: "Explanation", jx: "Principles", la: "Revolution" },
  50: { ra: "Laws", jx: "Values", la: "Wishes" },
  51: { ra: "Penetration", jx: "Shock", la: "Clarion" },
  52: { ra: "Service", jx: "Stillness", la: "Demands" },
  53: { ra: "Penetration", jx: "Beginnings", la: "Cycles" },
  54: { ra: "Penetration", jx: "Ambition", la: "Cycles" },
  55: { ra: "Sleeping Phoenix", jx: "Moods", la: "Spirit" },
  56: { ra: "Laws", jx: "Stimulation", la: "Distraction" },
  57: { ra: "Penetration", jx: "Intuition", la: "Clarion" },
  58: { ra: "Service", jx: "Vitality", la: "Demands" },
  59: { ra: "Sleeping Phoenix", jx: "Moods", la: "Spirit" },
  60: { ra: "Laws", jx: "Stimulation", la: "Distraction" },
  61: { ra: "Maya", jx: "Shock", la: "Obscuration" },
  62: { ra: "Maya", jx: "Intuition", la: "Obscuration" },
  63: { ra: "Consciousness", jx: "Doubts", la: "Dominion" },
  64: { ra: "Consciousness", jx: "Confusion", la: "Dominion" },
};

const ANGLE_KEY: Record<CrossAngle, keyof CrossThemes> = {
  "Right Angle": "ra",
  Juxtaposition: "jx",
  "Left Angle": "la",
};

/**
 * Canonical cross name, e.g. "Right Angle Cross of Eden". Falls back to a
 * structural label with the gate notation if a theme is somehow missing.
 */
export function crossName(
  angle: CrossAngle,
  personalitySun: number,
  personalityEarth: number,
  designSun: number,
  designEarth: number,
): string {
  const theme = THEMES[personalitySun]?.[ANGLE_KEY[angle]];
  if (theme) return `${angle} Cross of ${theme}`;
  return `${angle} Cross (${personalitySun}/${personalityEarth} | ${designSun}/${designEarth})`;
}
