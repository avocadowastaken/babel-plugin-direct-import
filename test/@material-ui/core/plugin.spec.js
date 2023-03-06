import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

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
    import Button from "@material-ui/core/esm/Button/Button.js";
    import * as colors from "@material-ui/core/esm/colors/index.js";
    import { ThemeProvider } from "@material-ui/styles";
  `);
});
