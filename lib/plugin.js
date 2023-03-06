"use strict";

const Transformer = require("./internal/Transformer.js");
const parseOptions = require("./utils/parseOptions.js");
const Parser = require("./internal/Parser.js");
const memoize = require("./utils/memoize.js");

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
      const { modules } = parseOptions(options);
      return new Transformer(modules, parser, babel.types);
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
