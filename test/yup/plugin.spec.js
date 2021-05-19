"use strict";

const runPlugin = require("../runPlugin");

test("transformation", () => {
  expect(
    runPlugin(
      'import { object, setLocale, addMethod, StringSchema } from "yup";',
      ["yup"]
    )
  ).toMatchInlineSnapshot(`
    import { create as object } from "yup/es/object.js";
    import setLocale from "yup/es/setLocale.js";
    import StringSchema from "yup/es/string.js";
    import { addMethod } from "yup";
  `);
});
