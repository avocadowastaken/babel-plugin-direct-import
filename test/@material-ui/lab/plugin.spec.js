"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin('import { Alert, AlertTitle } from "@material-ui/lab"', [
      "@material-ui/lab",
    ])
  ).toMatchInlineSnapshot(`
    import Alert from "@material-ui/lab/esm/Alert/index.js";
    import AlertTitle from "@material-ui/lab/esm/AlertTitle/index.js";
  `);
});
