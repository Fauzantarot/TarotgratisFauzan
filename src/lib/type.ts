/**
 * Aura Type, Strategy, Signature, Not-Self theme, and Inner Authority.
 *
 * Type is read from the defined centers plus a motor→Throat connectivity check;
 * Authority follows the canonical center hierarchy.
 */

import type { CenterGraph } from "./definition";
import { connectedToMotor } from "./definition";

export type HdType =
  | "Manifestor"
  | "Generator"
  | "Manifesting Generator"
  | "Projector"
  | "Reflector";

export interface TypeProfile {
  type: HdType;
  strategy: string;
  signature: string;
  notSelf: string;
}

const TYPE_TRAITS: Record<HdType, Omit<TypeProfile, "type">> = {
  Manifestor: { strategy: "To Inform", signature: "Peace", notSelf: "Anger" },
  Generator: { strategy: "To Respond", signature: "Satisfaction", notSelf: "Frustration" },
  "Manifesting Generator": {
    strategy: "To Respond, then Inform",
    signature: "Satisfaction & Peace",
    notSelf: "Frustration & Anger",
  },
  Projector: { strategy: "Wait for the Invitation", signature: "Success", notSelf: "Bitterness" },
  Reflector: { strategy: "Wait a Lunar Cycle (≈28 days)", signature: "Surprise", notSelf: "Disappointment" },
};

/** Determine the aura Type from the center graph. */
export function determineType(graph: CenterGraph): TypeProfile {
  const defined = graph.definedCenters;

  let type: HdType;
  if (defined.size === 0) {
    type = "Reflector";
  } else {
    const sacralDefined = defined.has("Sacral");
    const throatToMotor = connectedToMotor(graph, "Throat");
    if (sacralDefined) {
      type = throatToMotor ? "Manifesting Generator" : "Generator";
    } else if (throatToMotor) {
      type = "Manifestor";
    } else {
      type = "Projector";
    }
  }

  return { type, ...TYPE_TRAITS[type] };
}

export type AuthorityKind =
  | "Emotional (Solar Plexus)"
  | "Sacral"
  | "Splenic"
  | "Ego (Heart)"
  | "Self-Projected (G)"
  | "Mental (No Inner Authority)"
  | "Lunar (Reflector)";

/**
 * Inner Authority — the canonical decision hierarchy by defined center.
 * Emotional → Sacral → Splenic → Ego → Self-Projected → Mental → Lunar.
 */
export function determineAuthority(graph: CenterGraph, type: HdType): AuthorityKind {
  const d = graph.definedCenters;
  if (type === "Reflector") return "Lunar (Reflector)";
  if (d.has("SolarPlexus")) return "Emotional (Solar Plexus)";
  if (d.has("Sacral")) return "Sacral";
  if (d.has("Spleen")) return "Splenic";
  if (d.has("Heart")) return "Ego (Heart)";
  if (d.has("G")) return "Self-Projected (G)";
  return "Mental (No Inner Authority)";
}
