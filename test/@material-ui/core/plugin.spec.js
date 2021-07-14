"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      [
        'import Button from "@material-ui/core/Button"',
        'import { colors, makeStyles, ServerStyleSheets } from "@material-ui/core"',
      ].join("\n"),
      ["@material-ui/core", "@material-ui/core/Button"]
    )
  ).toMatchInlineSnapshot(`
    import Button from "@material-ui/core/esm/Button/Button.js";
    import * as colors from "@material-ui/core/esm/colors/index.js";
    import makeStyles from "@material-ui/core/esm/styles/makeStyles.js";
    import { ServerStyleSheets } from "@material-ui/styles/esm/ServerStyleSheets/ServerStyleSheets.js";
  `);
});
