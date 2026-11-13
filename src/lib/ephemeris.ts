/**
 * Ephemeris — geocentric, apparent ecliptic longitudes (of date) for the
 * planetary bodies Human Design uses.
 *
 * Human Design maps each body's TROPICAL ecliptic longitude (referred to the
 * true equinox of date) onto the 64-gate wheel — exactly what `astronomy-engine`
 * produces here:
 *   - Sun:    SunPosition().elon          (apparent geocentric, of date)
 *   - Moon:   EclipticGeoMoon().lon       (ECT, of date)
 *   - Planet: GeoVector (EQJ) → rotate to ECT → atan2(y, x)
 *
 * IMPORTANT (mirrors the gotcha carried from Astraea/Horizon): `EclipticLongitude()`
 * is *heliocentric* — wrong for a geocentric chart. We never use it.
 */

import * as Astronomy from "astronomy-engine";
import { norm360 } from "./math";

export const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
] as const;

export type Planet = (typeof PLANETS)[number];

const BODY: Record<Planet, Astronomy.Body> = {
  Sun: Astronomy.Body.Sun,
  Moon: Astronomy.Body.Moon,
  Mercury: Astronomy.Body.Mercury,
  Venus: Astronomy.Body.Venus,
  Mars: Astronomy.Body.Mars,
  Jupiter: Astronomy.Body.Jupiter,
  Saturn: Astronomy.Body.Saturn,
  Uranus: Astronomy.Body.Uranus,
  Neptune: Astronomy.Body.Neptune,
  Pluto: Astronomy.Body.Pluto,
};

/** Geocentric apparent ecliptic longitude of date, in [0, 360). */
export function eclipticLongitude(planet: Planet, date: Date): number {
  if (planet === "Sun") return norm360(Astronomy.SunPosition(date).elon);
  if (planet === "Moon") return norm360(Astronomy.EclipticGeoMoon(date).lon);

  const eqj = Astronomy.GeoVector(BODY[planet], date, true); // apparent (aberration on)
  const ect = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(date), eqj);
  return norm360((Math.atan2(ect.y, ect.x) * 180) / Math.PI);
}
