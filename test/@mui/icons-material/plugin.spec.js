import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

test("transformation", () => {
  expect(
    runPlugin(
      'import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";',
      ["@mui/icons-material"]
    )
  ).toMatchInlineSnapshot(`
    import ChevronLeftIcon from "@mui/icons-material/esm/ChevronLeft.js";
    import ChevronRightIcon from "@mui/icons-material/esm/ChevronRight.js";
  `);
});
