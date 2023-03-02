"use strict";

const Transformer = require("./internal/Transformer.js");
const parseOptions = require("./utils/parseOptions");
const Parser = require("./internal/Parser");
const LoadingCache = require("./internal/LoadingCache");

/**
 * @typedef {object} BabelAPI
 * @property {import("@babel/core").parse} parse
 * @property {import("@babel/core").types} types
 */

class Plugin {
  /** @readonly */
  #babel;
  /** @readonly */
  #parser;
  /** @readonly */
  #cache = new LoadingCache(
    /**
     * @param {object} options
     * @returns {Transformer}
     */
    (options) => {
      const { modules } = parseOptions(options);
      return new Transformer(modules, this.#parser, this.#babel.types);
    },
    { map: new WeakMap() }
  );

  /** @param {BabelAPI} babel */
  constructor(babel) {
    this.#babel = babel;
    this.#parser = new Parser(babel.parse, babel.types);
  }

  /**
   * @param {object} options
   * @returns {import("./internal/Transformer")}
   */
  getTransformer(options) {
    return this.#cache.load(options);
  }
}

/**
 * @param {BabelAPI} babel
 * @returns {import("@babel/core").PluginObj}
 */
module.exports = function createDirectImportPlugin(babel) {
  const plugin = new Plugin(babel);
  return {
    name: "babel-plugin-direct-import",
    visitor: {
      ImportDeclaration(declaration, { opts }) {
        plugin.getTransformer(opts).transform(declaration);
      },
    },
  };
};
