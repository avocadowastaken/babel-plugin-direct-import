"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      [
        'import Button, { ButtonProps } from "@mui/material/Button";',
        'import { colors, ThemeProvider, isHostComponent } from "@mui/material";',
      ].join("\n"),
      ["@mui/material", "@mui/material/Button"]
    )
  ).toMatchInlineSnapshot(`
    import Button from "@mui/material/Button/Button.js";
    import { ButtonProps } from "@mui/material/Button";
    import * as colors from "@mui/material/colors/index.js";
    import { ThemeProvider } from "@mui/system";
    import isHostComponent from "@mui/base/utils/isHostComponent.js";
  `);
});
