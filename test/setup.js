import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";

const CWD = path.join(fileURLToPath(import.meta.url), "..", "..");

/**
 * @param {string} input
 * @returns {string}
 */
function normalizeSeparators(input) {
  return input.replace(/\\/g, "/");
}

expect.addSnapshotSerializer({
  test(value) {
    return typeof value === "string" && value.includes(CWD);
  },
  serialize(value, config, indentation, depth, refs, printer) {
    let result = String(value).replace(CWD, "<cwd>");
    while (result.includes(CWD)) {
      result = result.replace(CWD, "<cwd>");
    }
    result = normalizeSeparators(result);
    return printer(result, config, indentation, depth, refs);
  },
});
