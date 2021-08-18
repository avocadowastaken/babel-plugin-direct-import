"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      [
        'import Button from "@material-ui/core/Button"',
        'import { colors, ThemeProvider } from "@material-ui/core"',
      ].join("\n"),
      ["@material-ui/core", "@material-ui/core/Button"]
    )
  ).toMatchInlineSnapshot(`
    import Button from "@material-ui/core/Button/Button.js";
    import * as colors from "@material-ui/core/colors/index.js";
    import ThemeProvider from "@material-ui/system";
  `);
});
