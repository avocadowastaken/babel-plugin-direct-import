"use strict";

const getModuleExports = require("../../lib/internal/getModuleExports");

test("exports", () => {
  expect(getModuleExports("yup")).toMatchInlineSnapshot(`
    Map {
      "mixed" => Object {
        "external": "mixed",
        "internal": "create",
        "source": "yup/es/mixed.js",
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
      "string" => Object {
        "external": "string",
        "internal": "create",
        "source": "yup/es/string.js",
      },
      "number" => Object {
        "external": "number",
        "internal": "create",
        "source": "yup/es/number.js",
      },
      "date" => Object {
        "external": "date",
        "internal": "create",
        "source": "yup/es/date.js",
      },
      "object" => Object {
        "external": "object",
        "internal": "create",
        "source": "yup/es/object.js",
      },
      "array" => Object {
        "external": "array",
        "internal": "create",
        "source": "yup/es/array.js",
      },
      "ref" => Object {
        "external": "ref",
        "internal": "create",
        "source": "yup/es/Reference.js",
      },
      "lazy" => Object {
        "external": "lazy",
        "internal": "create",
        "source": "yup/es/Lazy.js",
      },
      "reach" => Object {
        "external": "reach",
        "internal": "default",
        "source": "yup/es/util/reach.js",
      },
      "isSchema" => Object {
        "external": "isSchema",
        "internal": "default",
        "source": "yup/es/util/isSchema.js",
      },
      "setLocale" => Object {
        "external": "setLocale",
        "internal": "default",
        "source": "yup/es/setLocale.js",
      },
      "ValidationError" => Object {
        "external": "ValidationError",
        "internal": "default",
        "source": "yup/es/ValidationError.js",
      },
      "BaseSchema" => Object {
        "external": "BaseSchema",
        "internal": "default",
        "source": "yup/es/schema.js",
      },
      "MixedSchema" => Object {
        "external": "MixedSchema",
        "internal": "default",
        "source": "yup/es/mixed.js",
      },
      "BooleanSchema" => Object {
        "external": "BooleanSchema",
        "internal": "default",
        "source": "yup/es/boolean.js",
      },
      "StringSchema" => Object {
        "external": "StringSchema",
        "internal": "default",
        "source": "yup/es/string.js",
      },
      "NumberSchema" => Object {
        "external": "NumberSchema",
        "internal": "default",
        "source": "yup/es/number.js",
      },
      "DateSchema" => Object {
        "external": "DateSchema",
        "internal": "default",
        "source": "yup/es/date.js",
      },
      "ObjectSchema" => Object {
        "external": "ObjectSchema",
        "internal": "default",
        "source": "yup/es/object.js",
      },
      "ArraySchema" => Object {
        "external": "ArraySchema",
        "internal": "default",
        "source": "yup/es/array.js",
      },
    }
  `);
});
