"use strict";

const runPlugin = require("../../runPlugin");

test("transformation", () => {
  expect(
    runPlugin('import { Alert, AlertProps } from "@mui/lab"', ["@mui/lab"])
  ).toMatchInlineSnapshot(`
    import Alert from "@mui/lab/Alert/Alert.js";
    import { AlertProps } from "@mui/lab";
  `);
});
