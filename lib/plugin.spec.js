"use strict";

const babel = require("@babel/core");
const plugin = require("./plugin");

/**
 * @param {string} code
 * @param {unknown} options
 * @returns {null | string}
 */
function transform(code, options) {
  const result = babel.transformSync(code, {
    plugins: [[plugin, options], "@babel/plugin-syntax-flow"],
  });

  return (result && result.code) || null;
}

test("basic", () => {
  expect(
    transform('import { Button } from "@mui/material";', {
      modules: ["@mui/material"],
    })
  ).toMatchInlineSnapshot(
    `"import Button from \\"@mui/material/Button/Button.js\\";"`
  );
});

test("type imports", () => {
  expect(
    transform(
      `
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
`,
      { modules: ["@mui/material"] }
    )
  ).toMatchInlineSnapshot(`
    "import Button from \\"@mui/material/Button/Button.js\\";
    import type { ButtonProps } from \\"@mui/material\\";"
  `);
});

test("default import", () => {
  expect(
    transform('import Button from "@mui/material/Button";', {
      modules: ["@mui/material/Button"],
    })
  ).toMatchInlineSnapshot(
    `"import Button from \\"@mui/material/Button/Button.js\\";"`
  );
});

test("named import", () => {
  const warn = jest.spyOn(console, "warn").mockImplementation();

  expect(
    transform('import * as mui from "@mui/material";', {
      modules: ["@mui/material"],
    })
  ).toMatchInlineSnapshot(`"import * as mui from \\"@mui/material\\";"`);

  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  "babel-plugin-direct-import: Can not optimize 'import * as mui from \\"@mui/material\\"'.
See plugin limitations https://git.io/vFDOO for more details.",
]
`);

  warn.mockRestore();
});

test("string import", () => {
  expect(
    transform('import { "?" as Button } from "@mui/material";', {
      modules: ["@mui/material"],
    })
  ).toMatchInlineSnapshot(
    `"import { \\"?\\" as Button } from \\"@mui/material\\";"`
  );
});

test("deep module dependencies", () => {
  expect(
    transform('import { ThemeProvider as Theme } from "@mui/material";', {
      modules: ["@mui/material"],
    })
  ).toMatchInlineSnapshot(
    `"import { ThemeProvider as Theme } from \\"@mui/system\\";"`
  );

  expect(
    transform('import { ThemeProvider as Theme } from "@mui/material";', {
      modules: ["@mui/material", "@material-ui/system"],
    })
  ).toMatchInlineSnapshot(
    `"import { ThemeProvider as Theme } from \\"@mui/system\\";"`
  );
});
