"use strict";

const path = require("path");
const NodeModule = require("./NodeModule");

describe(".resolve", () => {
  test("basic", () => {
    expect(NodeModule.resolve("lodash")).toBe(
      path.join(process.cwd(), "node_modules", "lodash", "lodash.js")
    );

    expect(NodeModule.resolve("lodash/map")).toBe(
      path.join(process.cwd(), "node_modules", "lodash", "map.js")
    );

    expect(NodeModule.resolve("lodash/hey")).toBeNull();
  });

  test("errors", () => {
    expect(() => {
      // @ts-expect-error
      NodeModule.resolve(null);
    }).toThrowErrorMatchingInlineSnapshot('"Path must be a string."');
  });
});

describe(".get", () => {
  test("basic", () => {
    expect(NodeModule.get("luxon")).toEqual({
      id: "luxon",
      entry: path.join(
        process.cwd(),
        "node_modules",
        "luxon",
        "src",
        "luxon.js"
      ),
    });

    expect(NodeModule.get("@material-ui/core")).toEqual({
      id: "@material-ui/core",
      entry: path.join(
        process.cwd(),
        "node_modules",
        "@material-ui",
        "core",
        "esm",
        "index.js"
      ),
    });
  });
});
