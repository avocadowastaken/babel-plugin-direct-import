"use strict";

const babel = require("@babel/core");

const NodeModule = require("../lib/internal/NodeModule");
const DependencyTree = require("../lib/internal/DependencyTree");

/**
 * @param {string} id
 * @returns {unknown[]}
 */
module.exports = function testExports(id) {
  const tree = DependencyTree.create(NodeModule.get(id), babel);

  /** @type {Array<[id: string, internalID: string, source: string]>} */
  const result = [];

  for (const [id, { source, internalID }] of tree.getDependencies()) {
    result.push([id, internalID, source]);
  }

  return result.sort(([, , a], [, , b]) => a.localeCompare(b));
};
