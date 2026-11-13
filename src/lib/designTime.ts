/**
 * The Design (unconscious) moment.
 *
 * In Human Design the Design chart is cast for the instant the Sun was exactly
 * 88° of arc BEFORE its position at birth (~86–93 days earlier). The Sun's
 * apparent geocentric longitude increases strictly monotonically (it never
 * retrogrades), so within a window ~82–96 days before birth there is exactly one
 * instant where the Sun is 88° behind. We bracket that window and bisect.
 */

import { eclipticLongitude } from "./ephemeris";
import { norm360, signedDelta } from "./math";

const DAY_MS = 86_400_000;
export const SOLAR_ARC = 88; // degrees before the birth Sun

/** Solve for the Design instant: when SunLon = birthSunLon − 88°. */
export function designInstant(birth: Date): Date {
  const birthSun = eclipticLongitude("Sun", birth);
  const target = norm360(birthSun - SOLAR_ARC);

  // f(t) = signed angular distance from the target. Monotone increasing over the
  // window; negative ~96 days before birth, positive ~82 days before.
  const f = (t: Date) => signedDelta(eclipticLongitude("Sun", t), target);

  let lo = new Date(birth.getTime() - 96 * DAY_MS);
  let hi = new Date(birth.getTime() - 82 * DAY_MS);

  // Bracket sanity: widen once if the assumption ever fails (extreme edge cases).
  if (f(lo) > 0) lo = new Date(birth.getTime() - 100 * DAY_MS);
  if (f(hi) < 0) hi = new Date(birth.getTime() - 78 * DAY_MS);

  for (let i = 0; i < 60; i++) {
    const mid = new Date((lo.getTime() + hi.getTime()) / 2);
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return new Date((lo.getTime() + hi.getTime()) / 2);
}
