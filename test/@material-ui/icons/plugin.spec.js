"use strict";

const runPlugin = require("../../runPlugin");

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
