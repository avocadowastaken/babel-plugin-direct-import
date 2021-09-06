"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      'import { ThemeProvider, ThemeProviderProps } from "@material-ui/system";',
      ["@material-ui/system"]
    )
  ).toMatchInlineSnapshot(
    `import { ThemeProvider, ThemeProviderProps } from "@material-ui/system";`
  );
});
