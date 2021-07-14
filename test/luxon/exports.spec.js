"use strict";

const testExports = require("../testExports");

test("exports", () => {
  expect(testExports("luxon")).toMatchInlineSnapshot(`
    Array [
      Array [
        "DateTime",
        "default",
        "luxon/src/datetime.js",
      ],
      Array [
        "Duration",
        "default",
        "luxon/src/duration.js",
      ],
      Array [
        "Info",
        "default",
        "luxon/src/info.js",
      ],
      Array [
        "Interval",
        "default",
        "luxon/src/interval.js",
      ],
      Array [
        "VERSION",
        "VERSION",
        "luxon/src/luxon.js",
      ],
      Array [
        "Settings",
        "default",
        "luxon/src/settings.js",
      ],
      Array [
        "Zone",
        "default",
        "luxon/src/zone.js",
      ],
      Array [
        "FixedOffsetZone",
        "default",
        "luxon/src/zones/fixedOffsetZone.js",
      ],
      Array [
        "IANAZone",
        "default",
        "luxon/src/zones/IANAZone.js",
      ],
      Array [
        "InvalidZone",
        "default",
        "luxon/src/zones/invalidZone.js",
      ],
      Array [
        "LocalZone",
        "default",
        "luxon/src/zones/localZone.js",
      ],
    ]
  `);
});
