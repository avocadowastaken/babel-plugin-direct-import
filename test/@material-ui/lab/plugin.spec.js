"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin('import { Alert, AlertTitle } from "@material-ui/lab"', [
      "@material-ui/lab",
    ])
  ).toMatchInlineSnapshot(`
    import Alert from "@material-ui/lab/Alert/Alert.js";
    import AlertTitle from "@material-ui/lab/AlertTitle/AlertTitle.js";
  `);
});
