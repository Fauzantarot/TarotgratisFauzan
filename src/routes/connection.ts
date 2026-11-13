import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { connectionBody, type ConnectionBody } from "../schemas";
import { resolveBirth } from "./context";
import { computeBodyGraph } from "../lib/chart";
import { analyzeConnection } from "../lib/connection";
import { serializeConnection, ok } from "../lib/format";

export const connectionRouter = Router();

connectionRouter.post("/connection", validateBody(connectionBody), (_req, res) => {
  const b = res.locals.valid as ConnectionBody;
  const ra = resolveBirth(b.personA);
  const rb = resolveBirth(b.personB);

  const a = computeBodyGraph(ra.instant);
  const c = computeBodyGraph(rb.instant);

  const connection = analyzeConnection(a, c);

  res.json(
    ok(serializeConnection(connection), {
      personA: { type: a.type, authority: a.authority, profile: a.profile.profile, definition: a.definition },
      personB: { type: c.type, authority: c.authority, profile: c.profile.profile, definition: c.definition },
    }),
  );
});
