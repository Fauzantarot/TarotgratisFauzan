/** Angle primitives shared across the engine. Pure math on degrees. */

/** Wrap any angle into [0, 360). */
export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Smallest signed difference a − b, wrapped to (−180, 180]. */
export function signedDelta(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d <= -180) d += 360;
  return d;
}
