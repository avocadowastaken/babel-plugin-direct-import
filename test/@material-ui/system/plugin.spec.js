import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

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
