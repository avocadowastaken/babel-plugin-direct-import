import { expect, test } from "vitest";
import parseOptions from "./parseOptions";

test("basic", () => {
  expect(parseOptions({ modules: ["@mui/material", "@mui/material/Button"] }))
    .toMatchInlineSnapshot(`
    {
      "modules": Set {
        "@mui/material",
        "@mui/material/Button",
      },
    }
  `);
});

test.each([
  [{}, "invalid 'options.modules': not defined"],
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
  expect(() => parseOptions(input)).toThrow(error);
});
