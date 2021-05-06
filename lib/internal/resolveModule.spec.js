"use strict";

const path = require("path");
const resolveModule = require("./resolveModule");

test("package", () => {
  expect(resolveModule("lodash")).toContain(
    path.join("node_modules", "lodash", "lodash.js")
  );
});

it("should throw errors from `Module` package", () => {
  expect(() => {
    // @ts-expect-error
    resolveModule(null);
  }).toThrowErrorMatchingInlineSnapshot('"Path must be a string."');
});

it("should not throw when module is not installed", () => {
  expect(resolveModule("lodash/hey")).toBeNull();
});
