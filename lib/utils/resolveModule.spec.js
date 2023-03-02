"use strict";

const resolveModule = require("./resolveModule");

test("basic", () => {
  expect(resolveModule("@mui/material")).toMatchInlineSnapshot(
    `"<cwd>/node_modules/@mui/material/index.js"`
  );
  expect(resolveModule("@mui/material/Button")).toMatchInlineSnapshot(
    `"<cwd>/node_modules/@mui/material/Button/index.js"`
  );
  expect(() =>
    resolveModule("@mui/core/Button")
  ).toThrowErrorMatchingInlineSnapshot(
    `"Cannot find module '@mui/core/Button' from '<cwd>/lib/utils'"`
  );

  expect(() =>
    resolveModule(
      // @ts-expect-error
      null
    )
  ).toThrowErrorMatchingInlineSnapshot(`"Path must be a string."`);
});
