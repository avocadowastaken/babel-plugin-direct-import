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
  return Array.from(tree.getDependencies().values(), (dependency) => [
    dependency.id,
    dependency.internalID,
    dependency.source,
  ]).sort(([, , a], [, , b]) => a.localeCompare(b));
};
