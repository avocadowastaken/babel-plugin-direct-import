"use strict";

const testExports = require("../testExports");

test("exports", () => {
  expect(testExports("yup")).toMatchInlineSnapshot(`
    Map {
      "array" => Object {
        "external": "array",
        "internal": "create",
        "source": "yup/es/array.js",
      },
      "ArraySchema" => Object {
        "external": "ArraySchema",
        "internal": "default",
        "source": "yup/es/array.js",
      },
      "BaseSchema" => Object {
        "external": "BaseSchema",
        "internal": "default",
        "source": "yup/es/schema.js",
      },
      "bool" => Object {
        "external": "bool",
        "internal": "create",
        "source": "yup/es/boolean.js",
      },
      "boolean" => Object {
        "external": "boolean",
        "internal": "create",
        "source": "yup/es/boolean.js",
      },
      "BooleanSchema" => Object {
        "external": "BooleanSchema",
        "internal": "default",
        "source": "yup/es/boolean.js",
      },
      "date" => Object {
        "external": "date",
        "internal": "create",
        "source": "yup/es/date.js",
      },
      "DateSchema" => Object {
        "external": "DateSchema",
        "internal": "default",
        "source": "yup/es/date.js",
      },
      "isSchema" => Object {
        "external": "isSchema",
        "internal": "default",
        "source": "yup/es/util/isSchema.js",
      },
      "lazy" => Object {
        "external": "lazy",
        "internal": "create",
        "source": "yup/es/Lazy.js",
      },
      "mixed" => Object {
        "external": "mixed",
        "internal": "create",
        "source": "yup/es/mixed.js",
      },
      "MixedSchema" => Object {
        "external": "MixedSchema",
        "internal": "default",
        "source": "yup/es/mixed.js",
      },
      "number" => Object {
        "external": "number",
        "internal": "create",
        "source": "yup/es/number.js",
      },
      "NumberSchema" => Object {
        "external": "NumberSchema",
        "internal": "default",
        "source": "yup/es/number.js",
      },
      "object" => Object {
        "external": "object",
        "internal": "create",
        "source": "yup/es/object.js",
      },
      "ObjectSchema" => Object {
        "external": "ObjectSchema",
        "internal": "default",
        "source": "yup/es/object.js",
      },
      "reach" => Object {
        "external": "reach",
        "internal": "default",
        "source": "yup/es/util/reach.js",
      },
      "ref" => Object {
        "external": "ref",
        "internal": "create",
        "source": "yup/es/Reference.js",
      },
      "setLocale" => Object {
        "external": "setLocale",
        "internal": "default",
        "source": "yup/es/setLocale.js",
      },
      "string" => Object {
        "external": "string",
        "internal": "create",
        "source": "yup/es/string.js",
      },
      "StringSchema" => Object {
        "external": "StringSchema",
        "internal": "default",
        "source": "yup/es/string.js",
      },
      "ValidationError" => Object {
        "external": "ValidationError",
        "internal": "default",
        "source": "yup/es/ValidationError.js",
      },
    }
  `);
});
