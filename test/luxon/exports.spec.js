"use strict";

const getModuleExports = require("../../lib/internal/getModuleExports");

it("resolves exports for `luxon`", () => {
  expect(getModuleExports("luxon")).toMatchSnapshot();
});
