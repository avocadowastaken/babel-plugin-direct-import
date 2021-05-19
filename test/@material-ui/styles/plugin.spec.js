"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      'import { makeStyles, ClassNameMap } from "@material-ui/styles";',
      ["@material-ui/styles"]
    )
  ).toMatchInlineSnapshot(`
    import makeStyles from "@material-ui/styles/esm/makeStyles/index.js";
    import { ClassNameMap } from "@material-ui/styles";
  `);
});
