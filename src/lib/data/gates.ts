/**
 * The 64 Human Design gates: the wheel order (verified against the canonical
 * Rave Mandala — Gate 41 begins at 2°00' Aquarius = 302.0° tropical, gates run
 * in zodiacal order in clean 5.625° steps), plus each gate's name and a concise
 * keynote.
 *
 * Wheel order verified against published gate-by-zodiac-degree tables
 * (e.g. barneyandflow.com / bonniesorsby.com): 41,19,13,49,30,55,37,63,22,36,25,
 * 17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,
 * 64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60.
 */

/** Degrees of tropical ecliptic longitude where Gate 41 (start of the wheel) begins. */
export const WHEEL_ORIGIN = 302; // 2°00' Aquarius

/** Width of one gate (360 / 64) and one line (gate / 6), in degrees. */
export const GATE_WIDTH = 360 / 64; // 5.625
export const LINE_WIDTH = GATE_WIDTH / 6; // 0.9375

/** Gate numbers in zodiacal order around the wheel, starting at Gate 41. */
export const WHEEL: number[] = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
];

export interface GateInfo {
  number: number;
  name: string;
  keynote: string;
}

export const GATES: Record<number, GateInfo> = {
  1: { number: 1, name: "Self-Expression", keynote: "The Creative — the role model of individual creative expression." },
  2: { number: 2, name: "Direction of the Self", keynote: "The Receptive — the driver who knows the way by feel." },
  3: { number: 3, name: "Ordering", keynote: "Innovation that breaks through initial chaos into new order." },
  4: { number: 4, name: "Formulization", keynote: "Mental answers and the logic that resolves doubt." },
  5: { number: 5, name: "Fixed Rhythms", keynote: "Natural timing — waiting in one's own steady flow." },
  6: { number: 6, name: "Friction", keynote: "The gatekeeper of intimacy and emotional clarity." },
  7: { number: 7, name: "The Role of the Self", keynote: "Leadership that guides from behind toward the future." },
  8: { number: 8, name: "Contribution", keynote: "Standing behind what is genuinely worth expressing." },
  9: { number: 9, name: "Focus", keynote: "The power of detail and concentrated energy." },
  10: { number: 10, name: "Behavior of the Self", keynote: "Love of self and authentic conduct." },
  11: { number: 11, name: "Ideas", keynote: "Holding ideas as stimulating concepts to share." },
  12: { number: 12, name: "Caution", keynote: "The articulate voice that speaks in the right mood." },
  13: { number: 13, name: "The Listener", keynote: "The witness who gathers stories and secrets." },
  14: { number: 14, name: "Power Skills", keynote: "Fuel and resources directed by the soul's key." },
  15: { number: 15, name: "Extremes", keynote: "Embracing the full range of humanity; rhythm and flow." },
  16: { number: 16, name: "Skills", keynote: "Enthusiasm refined into mastery through repetition." },
  17: { number: 17, name: "Opinions", keynote: "Logical opinions seeking patterns and answers." },
  18: { number: 18, name: "Correction", keynote: "The drive to fix and perfect what is unhealthy." },
  19: { number: 19, name: "Wanting", keynote: "Sensitivity to needs — material, emotional, spiritual." },
  20: { number: 20, name: "The Now", keynote: "Awareness and being fully present in the moment." },
  21: { number: 21, name: "Control", keynote: "The hunter who must manage territory and resources." },
  22: { number: 22, name: "Openness", keynote: "Grace — the emotional charm that opens social space." },
  23: { number: 23, name: "Assimilation", keynote: "Turning insight into clear individual expression." },
  24: { number: 24, name: "Rationalization", keynote: "Returning to a thought until it finally makes sense." },
  25: { number: 25, name: "The Spirit of the Self", keynote: "Universal love and innocence." },
  26: { number: 26, name: "The Egoist", keynote: "The trickster who transmits value through will." },
  27: { number: 27, name: "Caring", keynote: "Nourishment and responsibility for others." },
  28: { number: 28, name: "The Game Player", keynote: "Risking to find purpose and meaning in the struggle." },
  29: { number: 29, name: "Saying Yes", keynote: "Commitment and perseverance through devotion." },
  30: { number: 30, name: "Recognition of Feelings", keynote: "The fire of desire, hopes, and dreams." },
  31: { number: 31, name: "Leading", keynote: "Influence through democratic leadership." },
  32: { number: 32, name: "Continuity", keynote: "Instinct for what endures and is worth keeping." },
  33: { number: 33, name: "Privacy", keynote: "Retreat to reflect and reveal the lessons of experience." },
  34: { number: 34, name: "Power", keynote: "Pure sacral power expressed through doing." },
  35: { number: 35, name: "Change", keynote: "Progress driven by the hunger for new experience." },
  36: { number: 36, name: "Crisis", keynote: "Diving into emotional experience and the untried." },
  37: { number: 37, name: "Friendship", keynote: "Warmth, community, and the bargains that bond." },
  38: { number: 38, name: "The Fighter", keynote: "Standing and fighting for what has meaning." },
  39: { number: 39, name: "Provocation", keynote: "Provoking spirit and emotion to find what matters." },
  40: { number: 40, name: "Aloneness", keynote: "The will to provide, balanced by the need to rest." },
  41: { number: 41, name: "Fantasy", keynote: "The contraction that initiates new feeling and experience." },
  42: { number: 42, name: "Maturation", keynote: "Seeing cycles through to completion and growth." },
  43: { number: 43, name: "Insight", keynote: "The breakthrough of individual knowing." },
  44: { number: 44, name: "Alertness", keynote: "Instinctive memory of patterns and the right people." },
  45: { number: 45, name: "The Gatherer", keynote: "The voice of the tribe gathering its resources." },
  46: { number: 46, name: "Love of the Body", keynote: "Determination and the serendipity of being in the body." },
  47: { number: 47, name: "Realization", keynote: "Turning mental confusion into realization." },
  48: { number: 48, name: "Depth", keynote: "The well of talent, skill, and wisdom." },
  49: { number: 49, name: "Principles", keynote: "Revolution founded on principles and ideals." },
  50: { number: 50, name: "Values", keynote: "The guardian of values and tribal law." },
  51: { number: 51, name: "Shock", keynote: "The arousing initiative that goes first." },
  52: { number: 52, name: "Stillness", keynote: "Keeping still to concentrate and see clearly." },
  53: { number: 53, name: "Beginnings", keynote: "The pressure to start new cycles and experiences." },
  54: { number: 54, name: "Ambition", keynote: "The drive to rise and transform through ambition." },
  55: { number: 55, name: "Spirit", keynote: "Emotional abundance — faith, moods, and spirit." },
  56: { number: 56, name: "Stimulation", keynote: "The storyteller who stimulates through ideas." },
  57: { number: 57, name: "Intuitive Clarity", keynote: "The intuition that hears truth in the now." },
  58: { number: 58, name: "Vitality", keynote: "The joy and aliveness that fuels correction." },
  59: { number: 59, name: "Intimacy", keynote: "Breaking down barriers to bond and reproduce." },
  60: { number: 60, name: "Acceptance", keynote: "Accepting limitation as the gateway to mutation." },
  61: { number: 61, name: "Inner Truth", keynote: "The pressure to know the mystery behind things." },
  62: { number: 62, name: "Detail", keynote: "Organizing facts and details into useful expression." },
  63: { number: 63, name: "Doubt", keynote: "The doubt that drives logical inquiry." },
  64: { number: 64, name: "Confusion", keynote: "The pressure of unresolved images seeking meaning." },
};

/** Convenience: the gate's display name. */
export function gateName(gate: number): string {
  return GATES[gate]?.name ?? `Gate ${gate}`;
}
