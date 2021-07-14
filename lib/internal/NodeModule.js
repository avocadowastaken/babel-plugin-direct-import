"use strict";

const assert = require("assert");
const resolve = require("resolve");

/** @type {Map<string, NodeModule>} */
const cache = new Map();

class NodeModule {
  /**
   * @param {string} id
   * @param {string} [basedir]
   * @returns {null | string}
   */
  static resolve(id, basedir) {
    try {
      return resolve.sync(id, {
        basedir,
        packageFilter(pkg) {
          return {
            ...pkg,
            main: pkg.module || pkg.esnext || pkg["jsnext:main"] || pkg.main,
          };
        },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        /** @type {NodeJS.ErrnoException} */ (error).code === "MODULE_NOT_FOUND"
      ) {
        return null;
      }

      throw error;
    }
  }

  /**
   * @param {string} id
   * @returns {NodeModule}
   */
  static get(id) {
    let module = cache.get(id);

    if (!module) {
      const entry = this.resolve(id);
      assert.ok(entry, `failed to find entry file of '${id}'.`);
      module = new NodeModule(id, entry);
      cache.set(id, module);
    }

    return module;
  }

  /**
   * @param {string} id
   * @param {string} entry
   * @protected
   */
  constructor(id, entry) {
    this.id = id;
    this.entry = entry;
  }
}

module.exports = NodeModule;
