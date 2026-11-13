/**
 * Transits — the gate/line activations of the bodies "now" (or at a given
 * instant). When a natal BodyGraph is supplied, flag the channels the transit
 * temporarily completes (transit-induced definition).
 */

import { activationsAt, type Activation } from "./bodies";
import { CHANNELS, channelKey } from "./data/channels";
import type { BodyGraph } from "./chart";

export interface CompletedChannel {
  channel: string; // "a-b"
  name: string;
  natalGate: number; // the gate you already hold
  transitGate: number; // the gate the transit brings
}

export interface TransitResult {
  instant: Date;
  activations: Activation[];
  activatedGates: number[];
  completedChannels?: CompletedChannel[];
}

/** Transit activations at an instant, optionally cross-referenced to a natal chart. */
export function computeTransits(instant: Date, natal?: BodyGraph): TransitResult {
  const activations = activationsAt(instant);
  const transitGates = new Set(activations.map((a) => a.gate));

  const result: TransitResult = {
    instant,
    activations,
    activatedGates: [...transitGates].sort((a, b) => a - b),
  };

  if (natal) {
    const natalGates = new Set(natal.activatedGates);
    const natalDefined = new Set(natal.definedChannels.map((c) => channelKey(c.gates[0], c.gates[1])));
    const completed: CompletedChannel[] = [];

    for (const ch of CHANNELS) {
      const [x, y] = ch.gates;
      const key = channelKey(x, y);
      if (natalDefined.has(key)) continue; // already defined natally

      const union = (g: number) => natalGates.has(g) || transitGates.has(g);
      if (!union(x) || !union(y)) continue; // not completed even together

      // It's completed by the union and one side comes from the transit.
      // Report the natal gate (held) and the transit gate (bridging) when the
      // transit genuinely contributes a gate the natal chart lacked.
      const natalHasX = natalGates.has(x);
      const natalHasY = natalGates.has(y);
      const transitHasX = transitGates.has(x);
      const transitHasY = transitGates.has(y);

      if (natalHasX && !natalHasY && transitHasY) {
        completed.push({ channel: key, name: ch.name, natalGate: x, transitGate: y });
      } else if (natalHasY && !natalHasX && transitHasX) {
        completed.push({ channel: key, name: ch.name, natalGate: y, transitGate: x });
      }
    }

    result.completedChannels = completed;
  }

  return result;
}
