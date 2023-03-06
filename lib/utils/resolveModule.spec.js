"use strict";

import { expect, test } from "vitest";
import resolveModule from "./resolveModule";

test("basic", () => {
  expect(resolveModule("@mui/material")).toMatchInlineSnapshot(
    `"<cwd>/node_modules/@mui/material/index.js"`
  );
});

test("deep module", () => {
  expect(resolveModule("@mui/material/Button")).toMatchInlineSnapshot(
    `"<cwd>/node_modules/@mui/material/Button/index.js"`
  );
});

test("invalid module", () => {
  expect(() =>
    resolveModule("@mui/core/Button")
  ).toThrowErrorMatchingInlineSnapshot(
    `"Can't resolve '@mui/core/Button' in '<cwd>/lib/utils'"`
  );
});
