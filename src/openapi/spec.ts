/** OpenAPI 3.1 spec for Rave — served at /openapi.json and rendered by Scalar at /. */

const birthDataSchema = {
  type: "object",
  required: ["date"],
  properties: {
    date: { type: "string", example: "1879-03-14", description: "Birth date, YYYY-MM-DD (years 1700–2200)." },
    time: { type: "string", example: "11:30", description: "Birth time, 24h HH:mm. Strongly recommended — Profile, Design & Cross depend on it." },
    latitude: { type: "number", example: 48.4, description: "Birth latitude (−90..90)." },
    longitude: { type: "number", example: 9.99, description: "Birth longitude (−180..180)." },
    tz: { type: "string", example: "Europe/Berlin", description: "IANA timezone. If omitted, resolved from latitude/longitude." },
  },
};

const errorResponse = {
  description: "Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "object",
            properties: { code: { type: "string" }, message: { type: "string" }, details: {} },
          },
        },
      },
    },
  },
};

export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Rave — Human Design API",
    version: "1.0.0",
    description:
      "A free, public, no-key Human Design API. Computes a full BodyGraph (Type, Strategy, Authority, " +
      "Profile, defined/open Centers, Channels, the 64 Gates, Definition, and the Incarnation Cross) from " +
      "birth date/time/place, plus two-person Connection charts, live Transits, and concise interpretations.\n\n" +
      "**Engine:** astronomy-engine (high-precision ephemeris). **Zodiac:** tropical, geocentric of-date. " +
      "**Nodes:** true (osculating). The Design chart is cast for the moment the Sun was 88° of arc before birth.",
    license: { name: "MIT" },
  },
  servers: [{ url: "/", description: "This server" }],
  tags: [
    { name: "Chart", description: "Single-person BodyGraph" },
    { name: "Connection", description: "Two-person relationship analysis" },
    { name: "Transits", description: "Current (or given-instant) gate activations" },
    { name: "Reference", description: "Lookups & keynotes" },
    { name: "Meta", description: "Service metadata" },
  ],
  paths: {
    "/v1/chart": {
      post: {
        tags: ["Chart"],
        summary: "Compute a full BodyGraph",
        description: "Returns Type, Strategy, Signature, Not-Self, Authority, Profile, Definition, Centers, defined Channels, the Incarnation Cross, the 26 planetary activations (Personality + Design), and concise interpretations.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: birthDataSchema,
              example: { date: "1879-03-14", time: "11:30", latitude: 48.4, longitude: 9.99, tz: "Europe/Berlin" },
            },
          },
        },
        responses: { "200": { description: "BodyGraph" }, "400": errorResponse },
      },
    },
    "/v1/connection": {
      post: {
        tags: ["Connection"],
        summary: "Analyze a relationship between two people",
        description: "Classifies every channel completed across the pair as Electromagnetic, Companionship, Dominance, or Compromise, and returns the composite definition.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["personA", "personB"],
                properties: { personA: birthDataSchema, personB: birthDataSchema },
              },
              example: {
                personA: { date: "1879-03-14", time: "11:30", tz: "Europe/Berlin", latitude: 48.4, longitude: 9.99 },
                personB: { date: "1955-10-28", time: "21:00", tz: "America/Los_Angeles", latitude: 37.77, longitude: -122.42 },
              },
            },
          },
        },
        responses: { "200": { description: "Connection analysis" }, "400": errorResponse },
      },
    },
    "/v1/transits": {
      get: {
        tags: ["Transits"],
        summary: "Current gate activations (the sky right now)",
        responses: { "200": { description: "Transit activations" } },
      },
      post: {
        tags: ["Transits"],
        summary: "Transits at an instant, optionally vs. a natal chart",
        description: "Omit the body for the current sky. Supply `natal` to also flag the channels the transit temporarily completes against your natal gates.",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  natal: birthDataSchema,
                  transitDate: { type: "string", example: "2026-07-01" },
                  transitTime: { type: "string", example: "12:00" },
                  transitTz: { type: "string", example: "UTC" },
                },
              },
              example: { natal: { date: "1879-03-14", time: "11:30", tz: "Europe/Berlin", latitude: 48.4, longitude: 9.99 } },
            },
          },
        },
        responses: { "200": { description: "Transit activations" }, "400": errorResponse },
      },
    },
    "/v1/reference/{category}": {
      get: {
        tags: ["Reference"],
        summary: "List a reference category",
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            example: "gates",
            schema: { type: "string", default: "gates", enum: ["gates", "lines", "channels", "centers", "types", "authorities", "profiles", "crosses"] },
          },
        ],
        responses: { "200": { description: "Reference list" }, "404": errorResponse },
      },
    },
    "/v1/reference/{category}/{key}": {
      get: {
        tags: ["Reference"],
        summary: "Look up one reference entry",
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            example: "gates",
            schema: { type: "string", default: "gates", enum: ["gates", "lines", "channels", "centers", "types", "authorities", "profiles", "crosses"] },
          },
          {
            name: "key",
            in: "path",
            required: true,
            example: "36",
            schema: { type: "string", default: "36" },
            description: "The entry within the category — e.g. gate 36, line 4, channel 1-8, center sacral, profile 1-4, cross gate 36.",
          },
        ],
        responses: { "200": { description: "Reference entry" }, "404": errorResponse },
      },
    },
    "/v1/meta": {
      get: { tags: ["Meta"], summary: "Service metadata", responses: { "200": { description: "Metadata" } } },
    },
  },
} as const;
