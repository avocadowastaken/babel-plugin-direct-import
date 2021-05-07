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

  return result?.code ?? null;
}

test("basic", () => {
  expect(
    transform('import { DateTime } from "luxon";', {
      modules: ["luxon"],
    })
  ).toBe('import DateTime from "luxon/src/datetime.js";');
});

test("type imports", () => {
  expect(
    transform(
      `
import { DateTime } from "luxon";
import type { Zone } from "luxon";
`,
      { modules: ["luxon"] }
    )
  ).toBe(
    `
import DateTime from "luxon/src/datetime.js";
import type { Zone } from "luxon";
`.trim()
  );
});

test("default import", () => {
  expect(
    transform('import Button from "@material-ui/core/Button";', {
      modules: ["@material-ui/core/Button"],
    })
  ).toBe('import Button from "@material-ui/core/esm/Button/Button.js";');
});

test("named import", () => {
  const warn = jest.spyOn(console, "warn").mockImplementation();

  expect(
    transform('import * as Luxon from "luxon";', {
      modules: ["luxon"],
    })
  ).toBe('import * as Luxon from "luxon";');

  expect(warn).toHaveBeenCalledTimes(1);
  expect(warn).toHaveBeenLastCalledWith(
    `
babel-plugin-direct-import: Can not optimize 'import * as Luxon from "luxon"'.
See plugin limitations https://git.io/vFDOO for more details.
`.trim()
  );

  warn.mockRestore();
});
