"use strict";

const path = require("path");
const NodeModule = require("./NodeModule");

describe(".resolve", () => {
  test("basic", () => {
    expect(NodeModule.resolve("@mui/material")).toBe(
      path.join(process.cwd(), "node_modules", "@mui", "material", "index.js")
    );

    expect(NodeModule.resolve("@mui/material/Button")).toBe(
      path.join(
        process.cwd(),
        "node_modules",
        "@mui",
        "material",
        "Button",
        "index.js"
      )
    );

    expect(NodeModule.resolve("@mui/core/Button")).toBeNull();
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
    expect(NodeModule.get("@mui/material")).toEqual({
      id: "@mui/material",
      entry: path.join(
        process.cwd(),
        "node_modules",
        "@mui",
        "material",
        "index.js"
      ),
    });

    expect(NodeModule.get("@mui/material/Button")).toEqual({
      id: "@mui/material/Button",
      entry: path.join(
        process.cwd(),
        "node_modules",
        "@mui",
        "material",
        "Button",
        "index.js"
      ),
    });
  });
});
