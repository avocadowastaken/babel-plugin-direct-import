"use strict";

const assert = require("assert");

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
      new Set(
        modules.map((module, idx) => {
          const optionPath = `options.modules[${idx}]`;

          assert.ok(
            typeof module == "string",
            `invalid '${optionPath}': not a 'string'`
          );
          assert.ok(!!module.length, `invalid '${optionPath}': value is empty`);

          return module;
        })
      )
    );

    pluginOptionsCache.set(opts, pluginOptions);

    return pluginOptions;
  }

  /**
   * @param {Set<string>} modules
   * @protected
   */
  constructor(modules) {
    this.modules = modules;
  }
}

module.exports = PluginOptions;
