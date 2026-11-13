import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

const EINSTEIN = { date: "1879-03-14", time: "11:30", latitude: 48.4, longitude: 9.99, tz: "Europe/Berlin" };

describe("POST /v1/chart", () => {
  it("computes Einstein's BodyGraph", async () => {
    const res = await request(app).post("/v1/chart").send(EINSTEIN);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.type).toBe("Generator");
    expect(res.body.data.authority).toBe("Emotional (Solar Plexus)");
    expect(res.body.data.profile.profile).toBe("1/4");
    expect(res.body.data.incarnationCross.name).toBe("Right Angle Cross of Eden");
    expect(res.body.data.interpretations).toBeTruthy();
    expect(res.body.data.activations.personality).toHaveLength(13);
    expect(res.body.meta.subject.instantUtc).toBeTruthy();
    expect(res.body.meta.designInstantUtc).toBeTruthy();
  });

  it("treats empty-string optional fields as absent", async () => {
    const res = await request(app).post("/v1/chart").send({ ...EINSTEIN, tz: "" });
    expect(res.status).toBe(200);
  });

  it("rejects an invalid date", async () => {
    const res = await request(app).post("/v1/chart").send({ date: "1879-13-40" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects an out-of-range year", async () => {
    const res = await request(app).post("/v1/chart").send({ date: "1500-01-01" });
    expect(res.status).toBe(400);
  });

  it("rejects an invalid timezone", async () => {
    const res = await request(app).post("/v1/chart").send({ date: "1990-01-01", time: "12:00", tz: "Mars/Olympus" });
    expect(res.status).toBe(400);
  });

  it("returns 400 (not 500) for malformed JSON", async () => {
    const res = await request(app).post("/v1/chart").set("Content-Type", "application/json").send('{"date":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_JSON");
  });

  it("sets rate-limit headers", async () => {
    const res = await request(app).post("/v1/chart").send(EINSTEIN);
    expect(res.headers["x-ratelimit-limit"]).toBeDefined();
  });
});

describe("POST /v1/connection", () => {
  it("classifies channels across two people", async () => {
    const res = await request(app)
      .post("/v1/connection")
      .send({ personA: EINSTEIN, personB: { date: "1955-10-28", time: "21:00", tz: "America/Los_Angeles", latitude: 37.77, longitude: -122.42 } });
    expect(res.status).toBe(200);
    expect(res.body.data.byKind).toBeTruthy();
    expect(res.body.data.summary).toHaveProperty("electromagnetic");
    expect(res.body.meta.personA.type).toBeTruthy();
  });
});

describe("transits", () => {
  it("GET returns the current 13 activations", async () => {
    const res = await request(app).get("/v1/transits");
    expect(res.status).toBe(200);
    expect(res.body.data.activations).toHaveLength(13);
  });

  it("POST with natal flags completed channels", async () => {
    const res = await request(app)
      .post("/v1/transits")
      .send({ natal: EINSTEIN, transitDate: "2026-07-01", transitTime: "12:00", transitTz: "UTC" });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.completedChannels)).toBe(true);
  });
});

describe("GET /v1/reference", () => {
  it("lists 64 gates", async () => {
    const res = await request(app).get("/v1/reference/gates");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(64);
  });
  it("looks up one gate", async () => {
    const res = await request(app).get("/v1/reference/gates/36");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Crisis");
  });
  it("lists 36 channels and looks one up", async () => {
    expect((await request(app).get("/v1/reference/channels")).body.data).toHaveLength(36);
    expect((await request(app).get("/v1/reference/channels/1-8")).body.data.name).toBe("Inspiration");
  });
  it("lists 9 centers, 5 types, 12 profiles", async () => {
    expect((await request(app).get("/v1/reference/centers")).body.data).toHaveLength(9);
    expect((await request(app).get("/v1/reference/types")).body.data).toHaveLength(5);
    expect((await request(app).get("/v1/reference/profiles")).body.data).toHaveLength(12);
  });
  it("looks up a profile via the dash alias", async () => {
    const res = await request(app).get("/v1/reference/profiles/1-4");
    expect(res.status).toBe(200);
    expect(res.body.data.profile).toBe("1/4");
  });
  it("404s an unknown category", async () => {
    expect((await request(app).get("/v1/reference/nonsense")).status).toBe(404);
  });
});

describe("GET /v1/meta", () => {
  it("returns service metadata", async () => {
    const res = await request(app).get("/v1/meta");
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Rave");
  });
});

describe("unknown route", () => {
  it("404s", async () => {
    expect((await request(app).get("/v1/nope")).status).toBe(404);
  });
});
