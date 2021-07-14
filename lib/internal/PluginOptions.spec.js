"use strict";

const PluginOptions = require("./PluginOptions.js");

test.each([
  ["luxon", new Map([["luxon", undefined]])],
  [{ name: "luxon" }, new Map([["luxon", undefined]])],
  [
    { name: "luxon", indexFile: "luxon/src/luxon" },
    new Map([["luxon", "luxon/src/luxon"]]),
  ],
])("parses %j -> %j", (input, modules) => {
  expect(PluginOptions.parse({ modules: [input] })).toEqual({ modules });
});

test.each([
  [null, "invalid 'options': not an 'object'"],
  [false, "invalid 'options': not an 'object'"],
  [undefined, "invalid 'options': not an 'object'"],

  [{}, "invalid 'options.modules': not an 'array'"],
  [{ modules: null }, "invalid 'options.modules': not an 'array'"],
  [{ modules: undefined }, "invalid 'options.modules': not an 'array'"],
  [{ modules: "luxon" }, "invalid 'options.modules': not an 'array'"],
  [
    { modules: { luxon: "luxon/src/luxon" } },
    "invalid 'options.modules': not an 'array'",
  ],

  [{ modules: [] }, "invalid 'options.modules': value is empty"],

  [
    { modules: ["luxon"], foo: "bar", baz: 10 },
    "invalid 'options': has unknown properties (foo, baz)",
  ],

  [{ modules: [""] }, "invalid 'options.modules[0]': value is empty"],
  [{ modules: ["luxon", ""] }, "invalid 'options.modules[1]': value is empty"],

  [
    { modules: [null] },
    "invalid 'options.modules[0]': not a 'string' or an 'object'",
  ],

  [
    { modules: [{ name: null }] },
    "invalid 'options.modules[0].name': not a 'string'",
  ],
  [
    { modules: [{ name: "" }] },
    "invalid 'options.modules[0].name': value is empty",
  ],

  [
    { modules: [{ name: "luxon", indexFile: {} }] },
    "invalid 'options.modules[0].indexFile': not a 'string'",
  ],
  [
    { modules: [{ name: "luxon", indexFile: "" }] },
    "invalid 'options.modules[0].indexFile': value is empty",
  ],
  [
    { modules: [{ name: "luxon", indexFile: "lodash-es/index" }] },
    "invalid 'options.modules[0]': 'lodash-es/index' not belong to 'luxon' package",
  ],
])("invalid options: %o -> %p", (input, error) => {
  expect(() => {
    // @ts-expect-error
    PluginOptions.parse(input);
  }).toThrow(error);
});
