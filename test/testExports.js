"use strict";

const babel = require("@babel/core");
const Parser = require("../lib/internal/Parser");

const parser = new Parser(babel.parse, babel.types);

/**
 * @param {string} entryId
 * @returns {unknown[]}
 */
module.exports = function testExports(entryId) {
  /** @type {[id: string, internalID: string, source: string][]} */
  const result = [];

  for (const [id, { source, internalID }] of parser.getDependenciesMap(
    entryId
  )) {
    result.push([id, internalID, source]);
  }

  return result.sort(([, , a], [, , b]) => a.localeCompare(b));
};
