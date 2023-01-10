const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");

/**
 * @type {import("pretty-format").NewPlugin}
 */
module.exports = {
  test(value) {
    return typeof value === "string" && value.startsWith(ROOT_DIR);
  },
  serialize(value, config, indentation, depth, refs, printer) {
    let result = String(value).replace(ROOT_DIR, "<cwd>");
    if (path.sep !== path.posix.sep) {
      result = result.split(path.sep).join(path.posix.sep);
    }
    return printer(result, config, indentation, depth, refs);
  },
};
