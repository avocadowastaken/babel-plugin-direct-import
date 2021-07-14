"use strict";

const path = require("path");
const resolvePackageEntry = require("./resolvePackageEntry");

test("basic", () => {
  expect(resolvePackageEntry("luxon")).toBe(
    path.join(process.cwd(), "node_modules", "luxon", "src", "luxon.js")
  );

  expect(resolvePackageEntry("@material-ui/core")).toBe(
    path.join(
      process.cwd(),
      "node_modules",
      "@material-ui",
      "core",
      "esm",
      "index.js"
    )
  );
});
