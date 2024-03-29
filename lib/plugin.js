"use strict";

const Transformer = require("./internal/Transformer");
const Parser = require("./internal/Parser");
const memoize = require("./utils/memoize");
const { parseConfig } = require("./config");

/**
 * @typedef {object} BabelAPI
 * @property {import("@babel/core").parse} parse
 * @property {import("@babel/core").types} types
 */

/**
 * @param {BabelAPI} babel
 * @returns {(
 *   path: import("@babel/core").NodePath<
 *     import("@babel/types").ImportDeclaration
 *   >,
 *   state: import("@babel/core").PluginPass
 * ) => void}
 */
function createImportDeclarationVisitor(babel) {
  const parser = new Parser(babel.parse, babel.types);
  /** @type {(options: object) => Transformer} */
  const getTransformer = memoize(
    (options) => {
      const config = parseConfig(options);
      return new Transformer(config, parser, babel.types);
    },
    { map: new WeakMap() }
  );
  return (path, { opts }) => {
    const transformer = getTransformer(opts);
    transformer.transform(path);
  };
}

/**
 * @param {BabelAPI} babel
 * @returns {import("@babel/core").PluginObj}
 */
module.exports = function createDirectImportPlugin(babel) {
  return {
    name: "babel-plugin-direct-import",
    visitor: { ImportDeclaration: createImportDeclarationVisitor(babel) },
  };
};
