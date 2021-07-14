"use strict";

const babel = require("@babel/core");

const NodeModule = require("../lib/internal/NodeModule");
const DependencyTree = require("../lib/internal/DependencyTree");

/**
 * @param {string} id
 * @returns {unknown[]}
 */
module.exports = function testExports(id) {
  const { dependencies } = DependencyTree.create(NodeModule.get(id), babel);

  return Array.from(dependencies.values(), (dependency) => [
    dependency.id,
    dependency.internalID,
    dependency.source,
  ]).sort(([, , a], [, , b]) => a.localeCompare(b));
};
