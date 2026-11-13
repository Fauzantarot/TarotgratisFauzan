/**
 * Connection (relationship) analysis between two BodyGraphs.
 *
 * For every channel completed across the pair, classify the dynamic:
 *   - Electromagnetic — each person holds ONE of the two gates (mutual attraction).
 *   - Companionship  — both people hold the WHOLE channel (shared, friendly).
 *   - Dominance      — one holds the whole channel, the other neither gate.
 *   - Compromise     — one holds the whole channel, the other just one gate.
 * Plus the composite definition (centers defined when the pair is together).
 */

import { CHANNELS, channelKey, type ChannelDef } from "./data/channels";
import { buildCenterGraph } from "./definition";
import type { BodyGraph } from "./chart";
import type { Center } from "./data/centers";

export type ConnectionKind = "Electromagnetic" | "Companionship" | "Dominance" | "Compromise";

export interface ConnectionChannel {
  channel: string; // "a-b"
  name: string;
  gates: [number, number];
  kind: ConnectionKind;
}

export interface ConnectionResult {
  channels: ConnectionChannel[];
  byKind: Record<ConnectionKind, string[]>;
  compositeDefinedCenters: Center[];
  compositeDefinition: string;
}

function classify(
  aHasX: boolean,
  aHasY: boolean,
  bHasX: boolean,
  bHasY: boolean,
): ConnectionKind | null {
  const aFull = aHasX && aHasY;
  const bFull = bHasX && bHasY;
  const completed = (aHasX || bHasX) && (aHasY || bHasY);
  if (!completed) return null;

  if (aFull && bFull) return "Companionship";
  if (aFull || bFull) {
    // One person owns the whole channel; classify by what the other contributes.
    const otherHasX = aFull ? bHasX : aHasX;
    const otherHasY = aFull ? bHasY : aHasY;
    const otherCount = (otherHasX ? 1 : 0) + (otherHasY ? 1 : 0);
    return otherCount === 0 ? "Dominance" : "Compromise";
  }
  // Neither owns the whole channel, but together it's completed → each holds one gate.
  return "Electromagnetic";
}

export function analyzeConnection(a: BodyGraph, b: BodyGraph): ConnectionResult {
  const aGates = new Set(a.activatedGates);
  const bGates = new Set(b.activatedGates);

  const channels: ConnectionChannel[] = [];
  const composite: ChannelDef[] = [];

  for (const ch of CHANNELS) {
    const [x, y] = ch.gates;
    const kind = classify(aGates.has(x), aGates.has(y), bGates.has(x), bGates.has(y));
    if (!kind) continue;
    channels.push({ channel: channelKey(x, y), name: ch.name, gates: ch.gates, kind });
    composite.push(ch); // completed across the pair → defines its centers in the composite
  }

  const byKind: Record<ConnectionKind, string[]> = {
    Electromagnetic: [],
    Companionship: [],
    Dominance: [],
    Compromise: [],
  };
  for (const c of channels) byKind[c.kind].push(c.channel);

  const graph = buildCenterGraph(composite);

  return {
    channels,
    byKind,
    compositeDefinedCenters: [...graph.definedCenters],
    compositeDefinition: graph.definition,
  };
}
