"use strict";

const babel = require("@babel/core");

const NodeModule = require("../lib/internal/NodeModule");
const getModuleExports = require("../lib/internal/getModuleExports");

/**
 * @param {string} id
 * @returns {Map<string, unknown>}
 */
module.exports = function testExports(id) {
  return new Map(
    Array.from(getModuleExports(NodeModule.get(id), babel)).sort(([a], [b]) =>
      a.localeCompare(b)
    )
  );
};
