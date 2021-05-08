"use strict";

const runPlugin = require("../../runPlugin");

test("transforms", () => {
  expect(
    runPlugin(
      'import { Autocomplete, createFilterOptions, useAutocomplete } from "@material-ui/lab"',
      ["@material-ui/lab"]
    )
  ).toMatchInlineSnapshot(`
    import Autocomplete from "@material-ui/lab/esm/Autocomplete/index.js";
    import { createFilterOptions } from "@material-ui/lab/esm/Autocomplete/Autocomplete.js";
    import useAutocomplete from "@material-ui/lab/esm/useAutocomplete/index.js";
  `);
});
