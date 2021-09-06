"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      'import { ThemeProvider, ThemeProviderProps } from "@mui/system";',
      ["@mui/system"]
    )
  ).toMatchInlineSnapshot(`
    import ThemeProvider from "@mui/system/esm/ThemeProvider/ThemeProvider.js";
    import { ThemeProviderProps } from "@mui/system";
  `);
});
