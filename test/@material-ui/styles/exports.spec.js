"use strict";

const getModuleExports = require("../../../lib/internal/getModuleExports");

it("resolves exports for `@material-ui/styles`", () => {
  expect(getModuleExports("@material-ui/styles")).toMatchSnapshot();
});
