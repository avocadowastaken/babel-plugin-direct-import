const Module = require("module");
const { format } = require("util");

/**
 * Resolve module file.
 *
 * @param {String} fileName
 * @param {String} cwd
 * @returns {String|null}
 */
function resolveFilename(fileName, cwd = process.cwd()) {
  try {
    const parent = new Module();

    // eslint-disable-next-line no-underscore-dangle
    parent.paths = Module._nodeModulePaths(cwd);

    // eslint-disable-next-line no-underscore-dangle
    return Module._resolveFilename(fileName, parent);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      console.warn(format("babel-plugin-direct-import: %s", error.message));

      return null;
    }

    throw error;
  }
}

module.exports = { resolveFilename };
