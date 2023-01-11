const path = require("path");

const CWD = path.join(__dirname, "..");

/**
 * @param {string} input
 * @returns {string}
 */
function normalizeSeparators(input) {
  return input.replace(/\\/g, "/");
}

/** @type {import("pretty-format").NewPlugin} */
module.exports = {
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
};
