import { describe, it, expect } from "vitest";
import { CHANNELS, type ChannelDef } from "../src/lib/data/channels";
import { buildCenterGraph, connectedToMotor } from "../src/lib/definition";
import { determineType, determineAuthority } from "../src/lib/type";
import { CHANNELS as ALL } from "../src/lib/data/channels";

/** Build a defined-channel list from gate pairs. */
function defined(...pairs: Array<[number, number]>): ChannelDef[] {
  return pairs.map(([a, b]) => {
    const ch = CHANNELS.find(
      (c) => (c.gates[0] === a && c.gates[1] === b) || (c.gates[0] === b && c.gates[1] === a),
    );
    if (!ch) throw new Error(`No channel ${a}-${b}`);
    return ch;
  });
}

const typeOf = (...pairs: Array<[number, number]>) => determineType(buildCenterGraph(defined(...pairs))).type;

describe("channel data", () => {
  it("has 36 channels, each connecting two distinct centers", () => {
    expect(ALL).toHaveLength(36);
    for (const c of ALL) expect(c.centers[0]).not.toBe(c.centers[1]);
  });
});

describe("Type decision tree", () => {
  it("Reflector — no centers defined", () => {
    expect(determineType(buildCenterGraph([])).type).toBe("Reflector");
  });

  it("Generator — Sacral defined, no motor to Throat", () => {
    expect(typeOf([5, 15])).toBe("Generator"); // Sacral–G
  });

  it("Manifesting Generator — Sacral defined and a motor reaches the Throat", () => {
    expect(typeOf([20, 34])).toBe("Manifesting Generator"); // Throat–Sacral
  });

  it("Manifestor — no Sacral, a motor reaches the Throat", () => {
    expect(typeOf([21, 45])).toBe("Manifestor"); // Heart–Throat
  });

  it("Projector — defined centers but no Sacral and no motor to Throat", () => {
    expect(typeOf([11, 56])).toBe("Projector"); // Ajna–Throat
    expect(typeOf([47, 64])).toBe("Projector"); // Head–Ajna
  });
});

describe("Authority hierarchy", () => {
  const auth = (...pairs: Array<[number, number]>) => {
    const g = buildCenterGraph(defined(...pairs));
    return determineAuthority(g, determineType(g).type);
  };

  it("Emotional when Solar Plexus is defined", () => {
    expect(auth([12, 22])).toBe("Emotional (Solar Plexus)"); // Throat–SolarPlexus
  });
  it("Sacral when Sacral defined and no Solar Plexus", () => {
    expect(auth([5, 15])).toBe("Sacral");
  });
  it("Splenic when Spleen defined and no SP/Sacral", () => {
    expect(auth([16, 48])).toBe("Splenic"); // Throat–Spleen
  });
  it("Ego when Heart defined and no SP/Sacral/Spleen", () => {
    expect(auth([21, 45])).toBe("Ego (Heart)"); // Heart–Throat
  });
  it("Self-Projected when only G (of the inner centers) is defined", () => {
    expect(auth([1, 8])).toBe("Self-Projected (G)"); // G–Throat
  });
  it("Mental when only Head/Ajna/Throat are defined", () => {
    expect(auth([11, 56])).toBe("Mental (No Inner Authority)"); // Ajna–Throat
  });
  it("Lunar for a Reflector", () => {
    expect(auth()).toBe("Lunar (Reflector)");
  });
});

describe("Definition (connected components)", () => {
  it("Single — one connected cluster", () => {
    expect(buildCenterGraph(defined([5, 15])).definition).toBe("Single Definition");
  });
  it("Split — two separate clusters", () => {
    expect(buildCenterGraph(defined([5, 15], [21, 45])).definition).toBe("Split Definition");
  });
  it("None — nothing defined", () => {
    expect(buildCenterGraph([]).definition).toBe("No Definition");
  });
});

describe("connectedToMotor", () => {
  it("true when the Throat shares a cluster with a motor", () => {
    expect(connectedToMotor(buildCenterGraph(defined([20, 34])), "Throat")).toBe(true); // Sacral motor
  });
  it("false when the Throat is only on non-motor centers", () => {
    expect(connectedToMotor(buildCenterGraph(defined([11, 56])), "Throat")).toBe(false);
  });
});
