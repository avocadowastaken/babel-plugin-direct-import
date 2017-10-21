const Module = require("module");

/**
 * Resolve module file.
 *
 * @param {String} fileName
 * @returns {String|null}
 */
function resolveFilename(fileName, relativeTo = process.cwd()) {
  try {
    const parent = new Module();

    // eslint-disable-next-line no-underscore-dangle
    parent.paths = Module._nodeModulePaths(relativeTo);

    // eslint-disable-next-line no-underscore-dangle
    return Module._resolveFilename(fileName, parent);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      console.warn(`babel-plugin-direct-import: ${error.message}`);

      return null;
    }

    throw error;
  }
}

module.exports = { resolveFilename };
