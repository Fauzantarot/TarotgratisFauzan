/** Request validation schemas (zod) for body + query inputs. */

import { z } from "zod";
import { isValidZone } from "../lib/timezone";

/**
 * Recursively drop empty-string / null properties before validation. API clients
 * (and the Scalar docs UI) routinely send `"tz": ""` for untouched optional
 * fields — those should mean "not provided", not a validation error.
 */
function stripEmpty(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripEmpty);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === "" || v === null) continue;
      out[k] = stripEmpty(v);
    }
    return out;
  }
  return value;
}

const latitude = z.coerce
  .number({ message: "latitude must be a number" })
  .min(-90, "latitude must be between -90 and 90")
  .max(90, "latitude must be between -90 and 90");

const longitude = z.coerce
  .number({ message: "longitude must be a number" })
  .min(-180, "longitude must be between -180 and 180")
  .max(180, "longitude must be between -180 and 180");

/** "YYYY-MM-DD" → { year, month, day }. */
const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
  .transform((s, ctx) => {
    const [year, month, day] = s.split("-").map(Number);
    const probe = new Date(Date.UTC(year, month - 1, day));
    if (probe.getUTCFullYear() !== year || probe.getUTCMonth() + 1 !== month || probe.getUTCDate() !== day) {
      ctx.addIssue({ code: "custom", message: "date is not a valid calendar date" });
      return z.NEVER;
    }
    if (year < 1700 || year > 2200) {
      ctx.addIssue({ code: "custom", message: "year must be between 1700 and 2200 (ephemeris range)" });
      return z.NEVER;
    }
    return { year, month, day };
  });

/** "HH:mm" (24h) → { hour, minute }. */
const clockTime = z
  .string()
  .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, "time must be in HH:mm (24-hour) format")
  .transform((s) => {
    const [hour, minute] = s.split(":").map(Number);
    return { hour, minute };
  });

const tz = z
  .string()
  .min(1)
  .refine(isValidZone, "must be a valid IANA timezone, e.g. 'Asia/Dhaka'")
  .optional();

/** Birth data shared by chart / connection / transits. */
export const birthData = z.object({
  date: calendarDate,
  time: clockTime.optional(),
  latitude: latitude.optional(),
  longitude: longitude.optional(),
  tz,
});
export type BirthData = z.infer<typeof birthData>;

/** POST /v1/chart */
export const chartBody = z.preprocess(stripEmpty, birthData);
export type ChartBody = z.infer<typeof chartBody>;

/** POST /v1/connection */
export const connectionBody = z.preprocess(
  stripEmpty,
  z.object({ personA: birthData, personB: birthData }),
);
export type ConnectionBody = z.infer<typeof connectionBody>;

/** POST /v1/transits — natal optional (omit for current sky only). */
export const transitsBody = z.preprocess(
  stripEmpty,
  z.object({
    natal: birthData.optional(),
    transitDate: calendarDate.optional(),
    transitTime: clockTime.optional(),
    transitTz: tz,
  }),
);
export type TransitsBody = z.infer<typeof transitsBody>;
