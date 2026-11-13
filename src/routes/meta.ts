import { Router } from "express";
import { ok } from "../lib/format";

export const metaRouter = Router();

metaRouter.get("/meta", (_req, res) => {
  res.json(
    ok({
      name: "Rave",
      description: "Free, public Human Design API — BodyGraph charts, connection charts, transits & interpretations.",
      version: "1.0.0",
      engine: "astronomy-engine",
      zodiac: "tropical, geocentric (of date)",
      nodes: "true (osculating) lunar nodes",
      endpoints: [
        "POST /v1/chart",
        "POST /v1/connection",
        "POST /v1/transits",
        "GET  /v1/transits",
        "GET  /v1/reference/:category[/:key]",
        "GET  /v1/meta",
        "GET  /openapi.json",
      ],
      docs: "/",
    }),
  );
});
