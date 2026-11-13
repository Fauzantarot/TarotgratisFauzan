import { describe, it, expect } from "vitest";
import { designInstant, SOLAR_ARC } from "../src/lib/designTime";
import { eclipticLongitude } from "../src/lib/ephemeris";
import { signedDelta } from "../src/lib/math";

describe("design-time solver", () => {
  const cases = [
    new Date(Date.UTC(1990, 0, 15, 6, 0)),
    new Date(Date.UTC(1879, 2, 14, 10, 50)),
    new Date(Date.UTC(2000, 6, 4, 0, 0)),
    new Date(Date.UTC(2024, 11, 31, 23, 59)),
  ];

  it("lands exactly 88° of solar arc before birth", () => {
    for (const birth of cases) {
      const design = designInstant(birth);
      const arc = signedDelta(eclipticLongitude("Sun", birth), eclipticLongitude("Sun", design));
      expect(arc).toBeCloseTo(SOLAR_ARC, 3);
    }
  });

  it("falls ~86–93 days before birth", () => {
    for (const birth of cases) {
      const days = (birth.getTime() - designInstant(birth).getTime()) / 86_400_000;
      expect(days).toBeGreaterThan(85);
      expect(days).toBeLessThan(94);
    }
  });
});
