/** Concise, hand-curated keynotes for the interpretive layer. */

import type { HdType } from "../type";
import type { AuthorityKind } from "../type";
import type { Center } from "./centers";

export const TYPE_KEYNOTE: Record<HdType, string> = {
  Manifestor: "Here to initiate and impact. Inform others before you act, and you find peace.",
  Generator: "Here to build and master through doing what you love. Respond, and you find satisfaction.",
  "Manifesting Generator":
    "A multi-passionate builder who moves fast and skips steps. Respond, then inform, and you find satisfaction.",
  Projector: "Here to guide and see others deeply. Wait for the invitation, and you find success.",
  Reflector: "A rare mirror of the community's health. Wait a lunar cycle to decide, and you find delight.",
};

export const AUTHORITY_KEYNOTE: Record<AuthorityKind, string> = {
  "Emotional (Solar Plexus)": "No truth in the now — ride out your emotional wave and clarity arrives over time.",
  Sacral: "Trust the in-the-moment gut response of your sacral (the 'uh-huh' yes / 'unh-unh' no).",
  Splenic: "Trust the quiet, spontaneous intuition that speaks once, in the now.",
  "Ego (Heart)": "Decide from what you genuinely want and have the willpower to back.",
  "Self-Projected (G)": "Talk it out — your truth is heard in your own voice as you speak.",
  "Mental (No Inner Authority)":
    "No inner gut to trust — talk it through with trusted sounding-boards in the right environment.",
  "Lunar (Reflector)": "Wait about 28 days, sampling the decision from many angles, before clarity settles.",
};

/** Center keynotes — defined (consistent) vs open (sampling / wisdom). */
export const CENTER_KEYNOTE: Record<Center, { defined: string; open: string }> = {
  Head: {
    defined: "A fixed way of being inspired and pressured by questions worth thinking about.",
    open: "Sampling many inspirations and questions; wisdom about which are even worth answering.",
  },
  Ajna: {
    defined: "A consistent way of conceptualizing, processing, and holding certainty.",
    open: "Mental flexibility — not fixed in any single way of thinking or knowing.",
  },
  Throat: {
    defined: "A consistent voice and a reliable way of manifesting and speaking.",
    open: "Adapts its voice to the moment; feels pressure to speak and be seen.",
  },
  G: {
    defined: "A fixed sense of identity, love, and direction in life.",
    open: "A fluid identity; finds direction through the right places and people.",
  },
  Heart: {
    defined: "Consistent willpower and the energy to make and keep promises.",
    open: "Wisdom about worth and value; nothing to prove.",
  },
  Sacral: {
    defined: "Sustainable life-force energy for work and response.",
    open: "Not built for relentless work; wisdom about energy and when enough is enough.",
  },
  Spleen: {
    defined: "A steady intuitive, instinctive sense of well-being and safety.",
    open: "Sensitive to health and fear; learns not to hold on to what isn't good.",
  },
  SolarPlexus: {
    defined: "Emotional waves move through you; clarity is a matter of time, not the now.",
    open: "Absorbs and amplifies the emotions in the room; deep empathy.",
  },
  Root: {
    defined: "A consistent way of handling pressure, stress, and adrenaline.",
    open: "Amplifies pressure and the rush to be free of it; learns it's never truly urgent.",
  },
};

/** A short keynote for each of the 36 channels, keyed by "a-b" (smaller gate first). */
export const CHANNEL_KEYNOTE: Record<string, string> = {
  "1-8": "The creative role model — contributing inspiration that makes a difference.",
  "2-14": "Direction fueled by resources; the keeper of life's keys.",
  "3-60": "Pulses of energy that drive mutation and new beginnings.",
  "4-63": "Mental pressure to find logical answers that resolve doubt.",
  "5-15": "Being in the natural rhythm and flow of life's patterns.",
  "6-59": "Intimacy and the raw energy to bond, mate, and reproduce.",
  "7-31": "Leadership that is recognized and given a voice to guide.",
  "9-52": "Focused, concentrated attention sustained on the details.",
  "10-20": "Self-empowerment lived authentically in the now.",
  "10-34": "Following one's own convictions through committed action.",
  "10-57": "Intuitive survival lived as authentic, self-loving behavior.",
  "11-56": "The seeker — turning ideas into stimulating stories to share.",
  "12-22": "Emotional, social expression that lands when the mood is right.",
  "13-33": "The witness — gathering experience and retelling it as wisdom.",
  "16-48": "Deep talent expressed through enthusiasm and practiced skill.",
  "17-62": "Organized logical opinions backed by the supporting detail.",
  "18-58": "The drive to correct and perfect for the sheer joy of it.",
  "19-49": "Sensitivity to needs and the principles that bond relationships.",
  "20-34": "Busy, powerful, productive doing expressed in the present.",
  "20-57": "Intuitive awareness expressed instantly, in the now.",
  "21-45": "Control and rightful stewardship of resources and territory.",
  "23-43": "Individual insight made into clear, original expression.",
  "24-61": "Mental pressure to know and rationalize the mystery of things.",
  "25-51": "The drive toward spirit through shock, love, and initiation.",
  "26-44": "The transmitter — selling instinct, memory, and value.",
  "27-50": "Nourishment and care guided by deeply held values.",
  "28-38": "The fight to find a purpose actually worth struggling for.",
  "29-46": "Devoted commitment to experience that succeeds against the odds.",
  "30-41": "The dream — desire and feeling that initiate new experience.",
  "32-54": "Ambition driven instinctively toward advancement and survival.",
  "34-57": "Instinctive power in the archetype of the warrior-survivor.",
  "35-36": "The restless hunger that always reaches for the next experience.",
  "37-40": "The bargain that holds family and community together.",
  "39-55": "Provoking spirit and moods to discover what truly matters.",
  "42-53": "The energy to begin and see cycles of growth through to the end.",
  "47-64": "Mental pressure to make sense of images from the past.",
};
