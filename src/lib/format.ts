/** Response shaping — turns engine output into the public JSON contract. */

import type { BodyGraph } from "./chart";
import type { Activation } from "./bodies";
import { BODY_LABEL } from "./bodies";
import { gateName } from "./data/gates";
import { channelKey } from "./data/channels";
import { interpretBodyGraph } from "./interpret";
import type { ConnectionResult } from "./connection";
import type { TransitResult } from "./transits";
import { gregorianLabel, formatInstant, type CalendarDate } from "./timezone";

/** Standard success envelope. */
export function ok<T>(data: T, meta?: unknown) {
  return { success: true as const, data, ...(meta ? { meta } : {}) };
}

function serializeActivation(a: Activation) {
  return {
    body: BODY_LABEL[a.body],
    activation: `${a.gate}.${a.line}`,
    gate: a.gate,
    gateName: gateName(a.gate),
    line: a.line,
    longitude: a.longitude,
  };
}

export interface SerializeOptions {
  interpret?: boolean;
}

/** Serialize a full BodyGraph. */
export function serializeBodyGraph(bg: BodyGraph, opts: SerializeOptions = {}) {
  const withText = opts.interpret !== false;

  return {
    type: bg.type,
    strategy: bg.strategy,
    signature: bg.signature,
    notSelf: bg.notSelf,
    authority: bg.authority,
    profile: {
      profile: bg.profile.profile,
      angle: bg.profile.angle,
      personalityLine: bg.profile.personalityLine,
      designLine: bg.profile.designLine,
      lines: {
        personality: bg.profile.lines.personality,
        design: bg.profile.lines.design,
      },
    },
    definition: bg.definition,
    incarnationCross: bg.incarnationCross,
    centers: bg.centers.map((c) => ({ center: c.key, name: c.name, defined: c.defined })),
    definedCenters: bg.definedCenters,
    openCenters: bg.openCenters,
    channels: bg.definedChannels.map((c) => ({
      channel: channelKey(c.gates[0], c.gates[1]),
      name: c.name,
      gates: c.gates,
      centers: c.centers,
    })),
    activatedGates: bg.activatedGates,
    activations: {
      personality: bg.personality.map(serializeActivation),
      design: bg.design.map(serializeActivation),
    },
    ...(withText ? { interpretations: interpretBodyGraph(bg) } : {}),
  };
}

/** Serialize a Connection (relationship) result. */
export function serializeConnection(conn: ConnectionResult) {
  return {
    summary: {
      electromagnetic: conn.byKind.Electromagnetic.length,
      companionship: conn.byKind.Companionship.length,
      dominance: conn.byKind.Dominance.length,
      compromise: conn.byKind.Compromise.length,
    },
    channels: conn.channels,
    byKind: conn.byKind,
    compositeDefinedCenters: conn.compositeDefinedCenters,
    compositeDefinition: conn.compositeDefinition,
  };
}

/** Serialize a Transit result. */
export function serializeTransits(t: TransitResult) {
  return {
    instant: t.instant.toISOString(),
    activatedGates: t.activatedGates,
    activations: t.activations.map(serializeActivation),
    ...(t.completedChannels ? { completedChannels: t.completedChannels } : {}),
  };
}

export interface SubjectMeta {
  date: CalendarDate;
  instant: Date;
  timezone: string;
  hasTime: boolean;
  latitude?: number;
  longitude?: number;
}

export function buildSubjectMeta(s: SubjectMeta) {
  return {
    subject: {
      date: gregorianLabel(s.date),
      time: s.hasTime ? formatInstant(s.instant, s.timezone).time24 : null,
      instantUtc: s.instant.toISOString(),
      ...(s.latitude !== undefined && s.longitude !== undefined
        ? { location: { latitude: s.latitude, longitude: s.longitude, timezone: s.timezone } }
        : {}),
    },
  };
}
