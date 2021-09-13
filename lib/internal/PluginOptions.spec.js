"use strict";

const path = require("path");
const PluginOptions = require("./PluginOptions.js");

test.each([
  [
    ["@mui/material", "@mui/material/Button"],
    new Map([
      [
        "@mui/material",
        {
          id: "@mui/material",
          entry: path.join(
            process.cwd(),
            "node_modules",
            "@mui",
            "material",
            "index.js"
          ),
        },
      ],
      [
        "@mui/material/Button",
        {
          id: "@mui/material/Button",
          entry: path.join(
            process.cwd(),
            "node_modules",
            "@mui",
            "material",
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
  [{ modules: "@mui/core" }, "invalid 'options.modules': not an 'array'"],
  [
    { modules: { "@mui/core": "@mui/core" } },
    "invalid 'options.modules': not an 'array'",
  ],

  [{ modules: [] }, "invalid 'options.modules': value is empty"],

  [
    { modules: ["@mui/core"], foo: "bar", baz: 10 },
    "invalid 'options': has unknown properties (foo, baz)",
  ],

  [{ modules: [""] }, "invalid 'options.modules[0]': value is empty"],
  [
    { modules: ["@mui/core", ""] },
    "invalid 'options.modules[1]': value is empty",
  ],

  [{ modules: [null] }, "invalid 'options.modules[0]': not a 'string'"],
])("invalid options: %o -> %p", (input, error) => {
  expect(() => {
    // @ts-expect-error
    PluginOptions.parse(input);
  }).toThrow(error);
});
