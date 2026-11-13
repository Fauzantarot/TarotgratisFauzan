/**
 * Center-graph analysis: which centers are defined, how they cluster, and the
 * connectivity queries the Type/Authority logic needs.
 *
 * Nodes = the 9 centers. Edges = the DEFINED channels (both gates active). A
 * center is "defined" when at least one defined channel touches it. "Definition"
 * is the number of connected components among the defined centers.
 */

import { CENTERS, MOTOR_CENTERS, type Center } from "./data/centers";
import type { ChannelDef } from "./data/channels";

export type DefinitionType =
  | "No Definition"
  | "Single Definition"
  | "Split Definition"
  | "Triple Split Definition"
  | "Quadruple Split Definition";

export interface CenterGraph {
  definedChannels: ChannelDef[];
  definedCenters: Set<Center>;
  /** Connected components among defined centers (each a set of centers). */
  components: Center[][];
  definition: DefinitionType;
}

const DEFINITION_BY_COMPONENTS: Record<number, DefinitionType> = {
  0: "No Definition",
  1: "Single Definition",
  2: "Split Definition",
  3: "Triple Split Definition",
  4: "Quadruple Split Definition",
};

/** Build the center graph from the set of defined channels. */
export function buildCenterGraph(definedChannels: ChannelDef[]): CenterGraph {
  const definedCenters = new Set<Center>();
  const adj = new Map<Center, Set<Center>>();
  for (const c of CENTERS) adj.set(c, new Set());

  for (const ch of definedChannels) {
    const [a, b] = ch.centers;
    definedCenters.add(a);
    definedCenters.add(b);
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  }

  // Connected components among defined centers (BFS).
  const seen = new Set<Center>();
  const components: Center[][] = [];
  for (const start of CENTERS) {
    if (!definedCenters.has(start) || seen.has(start)) continue;
    const comp: Center[] = [];
    const queue: Center[] = [start];
    seen.add(start);
    while (queue.length) {
      const node = queue.shift()!;
      comp.push(node);
      for (const next of adj.get(node)!) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    components.push(comp);
  }

  const definition =
    DEFINITION_BY_COMPONENTS[Math.min(components.length, 4)] ??
    (components.length > 4 ? "Quadruple Split Definition" : "No Definition");

  return { definedChannels, definedCenters, components, definition };
}

/** Is `center` defined and in the same component as any motor center? */
export function connectedToMotor(graph: CenterGraph, center: Center): boolean {
  if (!graph.definedCenters.has(center)) return false;
  const component = graph.components.find((comp) => comp.includes(center));
  if (!component) return false;
  return component.some((c) => MOTOR_CENTERS.includes(c));
}
