"use strict";

const babel = require("@babel/core");
const getModuleExports = require("../lib/internal/getModuleExports");

/**
 * @param {string} name
 * @returns {Map<string, unknown>}
 */
module.exports = function testExports(name) {
  return new Map(
    Array.from(getModuleExports(name, babel)).sort(([a], [b]) =>
      a.localeCompare(b)
    )
  );
};
