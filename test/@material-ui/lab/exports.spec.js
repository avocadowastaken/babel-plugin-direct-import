"use strict";

const getModuleExports = require("../../../lib/internal/getModuleExports");

test("exports", () => {
  expect(getModuleExports("@material-ui/lab")).toMatchSnapshot();
});
