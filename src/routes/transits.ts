import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { transitsBody, type TransitsBody } from "../schemas";
import { resolveBirth } from "./context";
import { computeBodyGraph } from "../lib/chart";
import { computeTransits } from "../lib/transits";
import { serializeTransits, ok } from "../lib/format";
import { birthInstant, localNoon, isValidZone } from "../lib/timezone";
import { ApiError } from "../middleware/errorHandler";

export const transitsRouter = Router();

function transitInstant(b: TransitsBody): Date {
  if (!b.transitDate) return new Date(); // current sky
  let zone = "UTC";
  if (b.transitTz) {
    if (!isValidZone(b.transitTz)) {
      throw new ApiError(400, "VALIDATION_ERROR", `Unknown timezone: ${b.transitTz}`, [
        { field: "transitTz", message: "must be a valid IANA timezone, e.g. 'Asia/Dhaka'" },
      ]);
    }
    zone = b.transitTz;
  }
  return b.transitTime ? birthInstant(b.transitDate, b.transitTime, zone) : localNoon(b.transitDate, zone);
}

function handleTransits(b: TransitsBody, res: import("express").Response) {
  const instant = transitInstant(b);
  const natal = b.natal ? computeBodyGraph(resolveBirth(b.natal).instant) : undefined;
  const result = computeTransits(instant, natal);
  res.json(
    ok(serializeTransits(result), {
      ...(natal ? { natal: { type: natal.type, authority: natal.authority, profile: natal.profile.profile } } : {}),
    }),
  );
}

transitsRouter.post("/transits", validateBody(transitsBody), (_req, res) => {
  handleTransits(res.locals.valid as TransitsBody, res);
});

// Convenience GET — the current sky's gate activations, no natal cross-reference.
transitsRouter.get("/transits", (_req, res) => {
  handleTransits({} as TransitsBody, res);
});
