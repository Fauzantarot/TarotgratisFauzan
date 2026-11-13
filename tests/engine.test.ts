import { describe, it, expect } from "vitest";
import { computeBodyGraph } from "../src/lib/chart";
import { channelKey } from "../src/lib/data/channels";

/**
 * End-to-end validation against Albert Einstein's published Human Design chart.
 * Born 14 Mar 1879, 11:30 LMT, Ulm (48.40°N, 9.99°E). Pre-1893 Germany kept no
 * standard time, so we anchor the recorded clock time to Local Mean Time by
 * longitude. Published chart: Generator · Emotional authority · 1/4 profile ·
 * Right Angle Cross of Eden (36/6 | 11/12) · Split Definition; defined channels
 * include 25-51, 30-41, 6-59; Head and Ajna are open.
 */
function einstein() {
  const lmtOffsetMin = (9.99 / 15) * 60;
  const utcMin = 11 * 60 + 30 - lmtOffsetMin;
  return computeBodyGraph(new Date(Date.UTC(1879, 2, 14, 0, 0, 0) + utcMin * 60_000));
}

describe("Einstein reference chart", () => {
  const bg = einstein();

  it("is a Generator with Emotional authority", () => {
    expect(bg.type).toBe("Generator");
    expect(bg.authority).toBe("Emotional (Solar Plexus)");
  });

  it("has a 1/4 Right-Angle profile", () => {
    expect(bg.profile.profile).toBe("1/4");
    expect(bg.profile.angle).toBe("Right Angle");
  });

  it("has the Right Angle Cross of Eden (36/6 | 11/12)", () => {
    expect(bg.incarnationCross.name).toBe("Right Angle Cross of Eden");
    expect(bg.incarnationCross.notation).toBe("36/6 | 11/12");
    expect(bg.incarnationCross.gates).toEqual({ personalitySun: 36, personalityEarth: 6, designSun: 11, designEarth: 12 });
    expect(bg.incarnationCross.quarter).toBe("Initiation");
  });

  it("has Split Definition", () => {
    expect(bg.definition).toBe("Split Definition");
  });

  it("defines channels 25-51, 30-41 and 6-59", () => {
    const defined = new Set(bg.definedChannels.map((c) => channelKey(c.gates[0], c.gates[1])));
    expect(defined.has("25-51")).toBe(true);
    expect(defined.has("30-41")).toBe(true);
    expect(defined.has("6-59")).toBe(true);
  });

  it("leaves Head and Ajna open", () => {
    expect(bg.openCenters).toContain("Head");
    expect(bg.openCenters).toContain("Ajna");
  });

  it("places Personality Sun in 36.1 and Design Sun in 11.4", () => {
    const pSun = bg.personality.find((a) => a.body === "Sun")!;
    const dSun = bg.design.find((a) => a.body === "Sun")!;
    expect(`${pSun.gate}.${pSun.line}`).toBe("36.1");
    expect(`${dSun.gate}.${dSun.line}`).toBe("11.4");
  });

  it("computes 13 personality + 13 design activations", () => {
    expect(bg.personality).toHaveLength(13);
    expect(bg.design).toHaveLength(13);
    // Earth is always opposite the Sun.
    const pSun = bg.personality.find((a) => a.body === "Sun")!;
    const pEarth = bg.personality.find((a) => a.body === "Earth")!;
    const sep = (((pEarth.longitude - pSun.longitude) % 360) + 360) % 360;
    expect(sep).toBeCloseTo(180, 3);
  });
});
