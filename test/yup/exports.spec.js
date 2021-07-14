"use strict";

const testExports = require("../testExports");

test("exports", () => {
  expect(testExports("yup")).toMatchInlineSnapshot(`
    Array [
      Array [
        "array",
        "create",
        "yup/es/array.js",
      ],
      Array [
        "ArraySchema",
        "default",
        "yup/es/array.js",
      ],
      Array [
        "bool",
        "create",
        "yup/es/boolean.js",
      ],
      Array [
        "boolean",
        "create",
        "yup/es/boolean.js",
      ],
      Array [
        "BooleanSchema",
        "default",
        "yup/es/boolean.js",
      ],
      Array [
        "date",
        "create",
        "yup/es/date.js",
      ],
      Array [
        "DateSchema",
        "default",
        "yup/es/date.js",
      ],
      Array [
        "addMethod",
        "addMethod",
        "yup/es/index.js",
      ],
      Array [
        "lazy",
        "create",
        "yup/es/Lazy.js",
      ],
      Array [
        "mixed",
        "create",
        "yup/es/mixed.js",
      ],
      Array [
        "MixedSchema",
        "default",
        "yup/es/mixed.js",
      ],
      Array [
        "number",
        "create",
        "yup/es/number.js",
      ],
      Array [
        "NumberSchema",
        "default",
        "yup/es/number.js",
      ],
      Array [
        "object",
        "create",
        "yup/es/object.js",
      ],
      Array [
        "ObjectSchema",
        "default",
        "yup/es/object.js",
      ],
      Array [
        "ref",
        "create",
        "yup/es/Reference.js",
      ],
      Array [
        "BaseSchema",
        "default",
        "yup/es/schema.js",
      ],
      Array [
        "setLocale",
        "default",
        "yup/es/setLocale.js",
      ],
      Array [
        "string",
        "create",
        "yup/es/string.js",
      ],
      Array [
        "StringSchema",
        "default",
        "yup/es/string.js",
      ],
      Array [
        "isSchema",
        "default",
        "yup/es/util/isSchema.js",
      ],
      Array [
        "reach",
        "default",
        "yup/es/util/reach.js",
      ],
      Array [
        "ValidationError",
        "default",
        "yup/es/ValidationError.js",
      ],
    ]
  `);
});
