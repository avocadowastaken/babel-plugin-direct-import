import { expect, test } from "vitest";
import { runPlugin } from "../../utils.js";

test("transformation", () => {
  expect(
    runPlugin('import { Alert, AlertTitle } from "@material-ui/lab"', [
      "@material-ui/lab",
    ])
  ).toMatchInlineSnapshot(`
    import Alert from "@material-ui/lab/esm/Alert/Alert.js";
    import AlertTitle from "@material-ui/lab/esm/AlertTitle/AlertTitle.js";
  `);
});
