"use strict";

const getModuleExports = require("../../../lib/internal/getModuleExports");

it("resolves exports for `@material-ui/core`", () => {
  expect(getModuleExports("@material-ui/core")).toMatchSnapshot();
  expect(getModuleExports("@material-ui/core", "es/index")).toMatchSnapshot();
});
