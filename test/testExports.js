"use strict";

const getModuleExports = require("../lib/internal/getModuleExports");

/**
 * @param {string} name
 * @param {string} [indexFile]
 * @returns {Map<string, unknown>}
 */
module.exports = function testExports(name, indexFile) {
  return new Map(
    Array.from(getModuleExports(name, indexFile)).sort(([a], [b]) =>
      a.localeCompare(b)
    )
  );
};
