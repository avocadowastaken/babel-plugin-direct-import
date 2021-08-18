"use strict";

const path = require("path");
const PluginOptions = require("./PluginOptions.js");

test.each([
  [
    ["luxon", "@material-ui/core", "@material-ui/core/Button"],
    new Map([
      [
        "luxon",
        {
          id: "luxon",
          entry: path.join(
            process.cwd(),
            "node_modules",
            "luxon",
            "src",
            "luxon.js"
          ),
        },
      ],
      [
        "@material-ui/core",
        {
          id: "@material-ui/core",
          entry: path.join(
            process.cwd(),
            "node_modules",
            "@material-ui",
            "core",
            "index.js"
          ),
        },
      ],
      [
        "@material-ui/core/Button",
        {
          id: "@material-ui/core/Button",
          entry: path.join(
            process.cwd(),
            "node_modules",
            "@material-ui",
            "core",
            "Button",
            "index.js"
          ),
        },
      ],
    ]),
  ],
])("parses %j -> %j", (input, modules) => {
  expect(PluginOptions.parse({ modules: input })).toEqual({ modules });
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

  [{ modules: [null] }, "invalid 'options.modules[0]': not a 'string'"],
])("invalid options: %o -> %p", (input, error) => {
  expect(() => {
    // @ts-expect-error
    PluginOptions.parse(input);
  }).toThrow(error);
});
