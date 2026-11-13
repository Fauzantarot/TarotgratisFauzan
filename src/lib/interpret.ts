/** Assemble the concise interpretation layer for a computed BodyGraph. */

import type { BodyGraph } from "./chart";
import { TYPE_KEYNOTE, AUTHORITY_KEYNOTE, CENTER_KEYNOTE, CHANNEL_KEYNOTE } from "./data/interpretations";
import { LINES } from "./profile";
import { channelKey } from "./data/channels";

export interface CenterInterpretation {
  center: string;
  defined: boolean;
  keynote: string;
}

export interface ChannelInterpretation {
  channel: string; // "a-b"
  name: string;
  keynote: string;
}

export interface ChartInterpretation {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  definition: string;
  incarnationCross: string;
  centers: CenterInterpretation[];
  channels: ChannelInterpretation[];
}

/** Build the interpretation block from a BodyGraph. */
export function interpretBodyGraph(bg: BodyGraph): ChartInterpretation {
  const pLine = LINES[bg.profile.personalityLine];
  const dLine = LINES[bg.profile.designLine];

  const profile =
    `${bg.profile.profile} — the ${pLine.name} / ${dLine.name}. ` +
    `${pLine.keynote} ${dLine.keynote}`;

  const centers: CenterInterpretation[] = bg.centers.map((c) => ({
    center: c.name,
    defined: c.defined,
    keynote: c.defined ? CENTER_KEYNOTE[c.key].defined : CENTER_KEYNOTE[c.key].open,
  }));

  const channels: ChannelInterpretation[] = bg.definedChannels.map((c) => {
    const key = channelKey(c.gates[0], c.gates[1]);
    return { channel: key, name: c.name, keynote: CHANNEL_KEYNOTE[key] ?? "" };
  });

  return {
    type: `${bg.type} — ${TYPE_KEYNOTE[bg.type]} Strategy: ${bg.strategy}.`,
    strategy: bg.strategy,
    authority: `${bg.authority} — ${AUTHORITY_KEYNOTE[bg.authority]}`,
    profile,
    definition: `${bg.definition} — describes how your defined centers connect into circuits.`,
    incarnationCross: `${bg.incarnationCross.name} — ${bg.incarnationCross.quarterTheme}`,
    centers,
    channels,
  };
}
