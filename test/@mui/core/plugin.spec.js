"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      'import { ButtonUnstyled, ButtonUnstyledProps } from "@mui/core";',
      ["@mui/core"]
    )
  ).toMatchInlineSnapshot(`
    import ButtonUnstyled from "@mui/core/ButtonUnstyled/ButtonUnstyled.js";
    import { ButtonUnstyledProps } from "@mui/core";
  `);
});
