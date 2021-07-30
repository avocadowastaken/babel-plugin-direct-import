"use strict";

const assert = require("assert");
const NodeModule = require("./NodeModule");

/** @type {WeakMap<object, PluginOptions>} */
const pluginOptionsCache = new WeakMap();

class PluginOptions {
  /** @param {import("@babel/core").PluginOptions} opts */
  static parse(opts) {
    assert.ok(!!opts, "invalid 'options': not an 'object'");

    const cached = pluginOptionsCache.get(opts);
    if (cached) return cached;

    const { modules, ...unknownPluginOptions } =
      /** @type {{ modules?: unknown }} */ (opts);

    assert.ok(
      Array.isArray(modules),
      "invalid 'options.modules': not an 'array'"
    );
    assert.ok(!!modules.length, "invalid 'options.modules': value is empty");

    const unknownPluginOptionKeys = Object.keys(unknownPluginOptions);

    assert.ok(
      !unknownPluginOptionKeys.length,
      `invalid 'options': has unknown properties (${unknownPluginOptionKeys.join(
        ", "
      )})`
    );

    const pluginOptions = new PluginOptions(
      new Map(
        modules.map((id, idx) => {
          const optionPath = `options.modules[${idx}]`;

          assert.ok(
            typeof id == "string",
            `invalid '${optionPath}': not a 'string'`
          );
          assert.ok(!!id.length, `invalid '${optionPath}': value is empty`);

          return [id, NodeModule.get(id)];
        })
      )
    );

    pluginOptionsCache.set(opts, pluginOptions);

    return pluginOptions;
  }

  /**
   * @param {Map<string, NodeModule>} modules
   * @protected
   */
  constructor(modules) {
    /**
     * @type {Map<string, NodeModule>}
     * @protected
     */
    this.modules = modules;
  }

  /**
   * @param {string} id
   * @returns {undefined | NodeModule}
   */
  findNodeModule(id) {
    return this.modules.get(id);
  }
}

module.exports = PluginOptions;
