import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { chartBody, type ChartBody } from "../schemas";
import { resolveBirth } from "./context";
import { computeBodyGraph } from "../lib/chart";
import { serializeBodyGraph, buildSubjectMeta, ok } from "../lib/format";

export const chartRouter = Router();

chartRouter.post("/", validateBody(chartBody), (_req, res) => {
  const b = res.locals.valid as ChartBody;
  const r = resolveBirth(b);

  const bodygraph = computeBodyGraph(r.instant);

  res.json(
    ok(
      serializeBodyGraph(bodygraph),
      {
        ...buildSubjectMeta({
          date: r.date,
          instant: r.instant,
          timezone: r.timezone,
          hasTime: r.hasTime,
          latitude: r.latitude,
          longitude: r.longitude,
        }),
        designInstantUtc: bodygraph.designInstant.toISOString(),
        ...(r.hasTime ? {} : { note: "No birth time supplied — computed for local noon. Provide 'time' for an accurate Profile, Design, and Cross." }),
      },
    ),
  );
});
