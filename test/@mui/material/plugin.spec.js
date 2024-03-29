import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

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
    import Button from "@mui/material/Button/Button.js";
    import { ButtonProps } from "@mui/material/Button";
    import * as colors from "@mui/material/colors/index.js";
    import { ThemeProvider } from "@mui/system";
    import useAutocomplete from "@mui/base/useAutocomplete";
  `);
});
