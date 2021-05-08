"use strict";

const runPlugin = require("../../runPlugin");

describe("@material-ui/styles", () => {
  it("transforms imports", () => {
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
});
