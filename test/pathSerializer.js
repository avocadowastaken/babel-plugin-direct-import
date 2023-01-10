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
    return printer(
      value.replace(ROOT_DIR, "<cwd>"),
      config,
      indentation,
      depth,
      refs
    );
  },
};
