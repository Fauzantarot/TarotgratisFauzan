import { describe, it, expect } from "vitest";
import { gateLineOf, gateStartLongitude } from "../src/lib/wheel";
import { WHEEL, WHEEL_ORIGIN, GATE_WIDTH, LINE_WIDTH, GATES } from "../src/lib/data/gates";

describe("gate wheel", () => {
  it("has 64 unique gates covering 1..64", () => {
    expect(WHEEL.length).toBe(64);
    expect(new Set(WHEEL).size).toBe(64);
    expect([...WHEEL].sort((a, b) => a - b)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
  });

  it("starts with Gate 41 at 302° (2° Aquarius)", () => {
    expect(WHEEL[0]).toBe(41);
    expect(WHEEL_ORIGIN).toBe(302);
    expect(gateStartLongitude(41)).toBeCloseTo(302, 6);
    expect(gateLineOf(302).gate).toBe(41);
    expect(gateLineOf(302).line).toBe(1);
  });

  it("follows the canonical sequence 41,19,13,49,30,55,…", () => {
    expect(WHEEL.slice(0, 6)).toEqual([41, 19, 13, 49, 30, 55]);
  });

  it("maps line boundaries within a gate", () => {
    // Gate 41 spans [302, 307.625). Six 0.9375° lines.
    expect(gateLineOf(302 + 0.0).line).toBe(1);
    expect(gateLineOf(302 + LINE_WIDTH * 1.5).line).toBe(2);
    expect(gateLineOf(302 + LINE_WIDTH * 5.5).line).toBe(6);
    expect(gateLineOf(302 + GATE_WIDTH - 0.001).gate).toBe(41);
    expect(gateLineOf(302 + GATE_WIDTH + 0.001).gate).toBe(19);
  });

  it("round-trips every gate's start longitude back to itself, line 1", () => {
    for (const g of WHEEL) {
      const gl = gateLineOf(gateStartLongitude(g) + 0.01);
      expect(gl.gate).toBe(g);
      expect(gl.line).toBe(1);
    }
  });

  it("wraps longitudes >= 360 and < 0", () => {
    expect(gateLineOf(302 + 360).gate).toBe(41);
    expect(gateLineOf(302 - 360).gate).toBe(41);
  });

  it("has a name + keynote for all 64 gates", () => {
    for (let g = 1; g <= 64; g++) {
      expect(GATES[g]?.name?.length).toBeGreaterThan(0);
      expect(GATES[g]?.keynote?.length).toBeGreaterThan(0);
    }
  });
});
