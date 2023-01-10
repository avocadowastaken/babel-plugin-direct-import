"use strict";

const NodeModule = require("./NodeModule");

describe(".resolve", () => {
  test("basic", () => {
    expect(NodeModule.resolve("@mui/material")).toMatchInlineSnapshot(
      `"<cwd>/node_modules/@mui/material/esm/index.js"`
    );
    expect(NodeModule.resolve("@mui/material/Button")).toMatchInlineSnapshot(
      `"<cwd>/node_modules/@mui/material/esm/Button/index.js"`
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
    expect(NodeModule.get("@mui/material")).toMatchInlineSnapshot(`
      NodeModule {
        "entry": "<cwd>/node_modules/@mui/material/esm/index.js",
        "id": "@mui/material",
      }
    `);
    expect(NodeModule.get("@mui/material/Button")).toMatchInlineSnapshot(`
      NodeModule {
        "entry": "<cwd>/node_modules/@mui/material/esm/Button/index.js",
        "id": "@mui/material/Button",
      }
    `);
  });
});
