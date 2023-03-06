import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

test("transformation", () => {
  expect(
    runPlugin(
      'import { ChevronLeft, ChevronRight  } from "@material-ui/icons"',
      ["@material-ui/icons"]
    )
  ).toMatchInlineSnapshot(`
      import ChevronLeft from "@material-ui/icons/esm/ChevronLeft.js";
      import ChevronRight from "@material-ui/icons/esm/ChevronRight.js";
    `);
});
