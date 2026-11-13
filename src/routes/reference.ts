import { Router, type Request, type Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import { ok } from "../lib/format";
import { GATES, gateName } from "../lib/data/gates";
import { CENTERS, CENTER_INFO, GATE_CENTER } from "../lib/data/centers";
import { CHANNELS, channelKey } from "../lib/data/channels";
import { LINES } from "../lib/profile";
import { buildProfile } from "../lib/profile";
import {
  TYPE_KEYNOTE,
  AUTHORITY_KEYNOTE,
  CENTER_KEYNOTE,
  CHANNEL_KEYNOTE,
} from "../lib/data/interpretations";
import { crossName } from "../lib/data/crosses";
import type { HdType } from "../lib/type";

export const referenceRouter = Router();

const TYPE_TRAITS: Record<HdType, { strategy: string; signature: string; notSelf: string }> = {
  Manifestor: { strategy: "To Inform", signature: "Peace", notSelf: "Anger" },
  Generator: { strategy: "To Respond", signature: "Satisfaction", notSelf: "Frustration" },
  "Manifesting Generator": { strategy: "To Respond, then Inform", signature: "Satisfaction & Peace", notSelf: "Frustration & Anger" },
  Projector: { strategy: "Wait for the Invitation", signature: "Success", notSelf: "Bitterness" },
  Reflector: { strategy: "Wait a Lunar Cycle", signature: "Surprise", notSelf: "Disappointment" },
};

const PROFILE_COMBOS = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6", "4/1", "5/1", "5/2", "6/2", "6/3"];

const gatesList = () =>
  Object.values(GATES).map((g) => ({ number: g.number, name: g.name, center: GATE_CENTER[g.number], keynote: g.keynote }));

const linesList = () => Object.values(LINES);

const channelsList = () =>
  CHANNELS.map((c) => {
    const key = channelKey(c.gates[0], c.gates[1]);
    return { channel: key, name: c.name, gates: c.gates, centers: c.centers, keynote: CHANNEL_KEYNOTE[key] ?? "" };
  });

const centersList = () =>
  CENTERS.map((c) => ({
    center: c,
    name: CENTER_INFO[c].name,
    kind: CENTER_INFO[c].kind,
    motor: CENTER_INFO[c].motor,
    gates: CENTER_INFO[c].gates,
    keynote: CENTER_KEYNOTE[c],
  }));

const typesList = () =>
  (Object.keys(TYPE_TRAITS) as HdType[]).map((t) => ({ type: t, ...TYPE_TRAITS[t], keynote: TYPE_KEYNOTE[t] }));

const authoritiesList = () =>
  (Object.keys(AUTHORITY_KEYNOTE) as Array<keyof typeof AUTHORITY_KEYNOTE>).map((a) => ({
    authority: a,
    keynote: AUTHORITY_KEYNOTE[a],
  }));

const profilesList = () =>
  PROFILE_COMBOS.map((p) => {
    const [pl, dl] = p.split("/").map(Number);
    const prof = buildProfile(pl, dl);
    return {
      profile: p,
      angle: prof.angle,
      personality: prof.lines.personality,
      design: prof.lines.design,
    };
  });

const crossesList = () =>
  Object.keys(GATES)
    .map(Number)
    .map((g) => ({
      personalitySunGate: g,
      rightAngle: crossName("Right Angle", g, 0, 0, 0),
      juxtaposition: crossName("Juxtaposition", g, 0, 0, 0),
      leftAngle: crossName("Left Angle", g, 0, 0, 0),
    }));

function handleReference(req: Request, res: Response): Response {
  const params = req.params as Record<string, string | undefined>;
  const category = params.category as string;
  const key = params.key;
  const k = key?.toLowerCase();

  switch (category) {
    case "gates": {
      if (!k) return res.json(ok(gatesList()));
      const g = Number(key);
      if (!GATES[g]) throw new ApiError(404, "NOT_FOUND", `Unknown gate: ${key} (use 1–64)`);
      return res.json(ok({ number: g, name: gateName(g), center: GATE_CENTER[g], keynote: GATES[g].keynote }));
    }
    case "lines": {
      if (!k) return res.json(ok(linesList()));
      const l = Number(key);
      if (!LINES[l]) throw new ApiError(404, "NOT_FOUND", `Unknown line: ${key} (use 1–6)`);
      return res.json(ok(LINES[l]));
    }
    case "channels": {
      if (!k) return res.json(ok(channelsList()));
      const entry = channelsList().find((c) => c.channel === k);
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown channel: ${key} (format "a-b", e.g. "1-8")`);
      return res.json(ok(entry));
    }
    case "centers": {
      if (!k) return res.json(ok(centersList()));
      const entry = centersList().find((c) => c.center.toLowerCase() === k);
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown center: ${key}`);
      return res.json(ok(entry));
    }
    case "types": {
      if (!k) return res.json(ok(typesList()));
      const entry = typesList().find((t) => t.type.toLowerCase() === k);
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown type: ${key}`);
      return res.json(ok(entry));
    }
    case "authorities": {
      if (!k) return res.json(ok(authoritiesList()));
      const entry = authoritiesList().find((a) => a.authority.toLowerCase().includes(k));
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown authority: ${key}`);
      return res.json(ok(entry));
    }
    case "profiles": {
      if (!k) return res.json(ok(profilesList()));
      // Path can't carry a "/", so accept "1-3" as an alias for "1/3".
      const norm = (key as string).replace("-", "/");
      const entry = profilesList().find((p) => p.profile === norm);
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown profile: ${key} (e.g. "1/3" or "1-3")`);
      return res.json(ok(entry));
    }
    case "crosses": {
      if (!k) return res.json(ok(crossesList()));
      const g = Number(key);
      const entry = crossesList().find((c) => c.personalitySunGate === g);
      if (!entry) throw new ApiError(404, "NOT_FOUND", `Unknown cross gate: ${key} (use a Personality Sun gate 1–64)`);
      return res.json(ok(entry));
    }
    default:
      throw new ApiError(
        404,
        "NOT_FOUND",
        `Unknown reference category: ${category}. Try gates, lines, channels, centers, types, authorities, profiles, or crosses.`,
      );
  }
}

referenceRouter.get("/reference/:category", handleReference);
referenceRouter.get("/reference/:category/:key", handleReference);
