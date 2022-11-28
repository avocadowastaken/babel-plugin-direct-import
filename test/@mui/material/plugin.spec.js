"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      [
        'import Button, { ButtonProps } from "@mui/material/Button";',
        'import { colors, ThemeProvider, useAutocomplete } from "@mui/material";',
      ].join("\n"),
      ["@mui/material", "@mui/material/Button"]
    )
  ).toMatchInlineSnapshot(`
    import Button from "@mui/material/esm/Button/Button.js";
    import { ButtonProps } from "@mui/material/Button";
    import * as colors from "@mui/material/esm/colors/index.js";
    import { ThemeProvider } from "@mui/system";
    import useAutocomplete from "@mui/base/AutocompleteUnstyled";
  `);
});
