/**
 * BodyGraph orchestrator — turns a birth instant into a full Human Design chart:
 * Personality + Design activations, defined channels & centers, Type, Authority,
 * Profile, Definition, and the Incarnation Cross.
 */

import { activationsAt, type Activation, type HdBody } from "./bodies";
import { designInstant } from "./designTime";
import { CHANNELS, type ChannelDef } from "./data/channels";
import { CENTERS, CENTER_INFO, type Center } from "./data/centers";
import { buildCenterGraph, type DefinitionType } from "./definition";
import { determineType, determineAuthority, type HdType, type AuthorityKind } from "./type";
import { buildProfile, type Profile } from "./profile";
import { buildCross, type IncarnationCross } from "./cross";

export interface CenterState {
  key: Center;
  name: string;
  defined: boolean;
}

export interface BodyGraph {
  birthInstant: Date;
  designInstant: Date;
  personality: Activation[];
  design: Activation[];
  activatedGates: number[];
  definedChannels: ChannelDef[];
  centers: CenterState[];
  definedCenters: Center[];
  openCenters: Center[];
  type: HdType;
  strategy: string;
  signature: string;
  notSelf: string;
  authority: AuthorityKind;
  profile: Profile;
  definition: DefinitionType;
  incarnationCross: IncarnationCross;
}

function activation(list: Activation[], body: HdBody): Activation {
  const a = list.find((x) => x.body === body);
  if (!a) throw new Error(`Missing activation for ${body}`);
  return a;
}

/** Compute the full BodyGraph for a birth instant. */
export function computeBodyGraph(birth: Date): BodyGraph {
  const dInstant = designInstant(birth);
  const personality = activationsAt(birth);
  const design = activationsAt(dInstant);

  const activated = new Set<number>();
  for (const a of personality) activated.add(a.gate);
  for (const a of design) activated.add(a.gate);

  const definedChannels = CHANNELS.filter((ch) => activated.has(ch.gates[0]) && activated.has(ch.gates[1]));
  const graph = buildCenterGraph(definedChannels);

  const centers: CenterState[] = CENTERS.map((key) => ({
    key,
    name: CENTER_INFO[key].name,
    defined: graph.definedCenters.has(key),
  }));

  const { type, strategy, signature, notSelf } = determineType(graph);
  const authority = determineAuthority(graph, type);

  const pSun = activation(personality, "Sun");
  const pEarth = activation(personality, "Earth");
  const dSun = activation(design, "Sun");
  const dEarth = activation(design, "Earth");

  const profile = buildProfile(pSun.line, dSun.line);
  const incarnationCross = buildCross(pSun.gate, pEarth.gate, dSun.gate, dEarth.gate, profile.angle);

  return {
    birthInstant: birth,
    designInstant: dInstant,
    personality,
    design,
    activatedGates: [...activated].sort((a, b) => a - b),
    definedChannels,
    centers,
    definedCenters: CENTERS.filter((c) => graph.definedCenters.has(c)),
    openCenters: CENTERS.filter((c) => !graph.definedCenters.has(c)),
    type,
    strategy,
    signature,
    notSelf,
    authority,
    profile,
    definition: graph.definition,
    incarnationCross,
  };
}
