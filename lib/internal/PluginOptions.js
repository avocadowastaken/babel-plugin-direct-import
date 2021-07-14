"use strict";

const assert = require("assert");

/** @type {WeakMap<object, PluginOptions>} */
const pluginOptionsCache = new WeakMap();

/**
 * @typedef {object} ModuleConfig
 * @property {string} name
 * @property {string} [indexFile]
 */

/**
 * @typedef {object} PluginOptionsInit
 * @property {ModuleConfig[]} modules
 */

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
        modules.map((moduleConfig, idx) => {
          const optionPath = `options.modules[${idx}]`;

          if (typeof moduleConfig == "string") {
            assert.ok(
              !!moduleConfig.length,
              `invalid '${optionPath}': value is empty`
            );

            return [moduleConfig, undefined];
          }

          assert.ok(
            typeof moduleConfig == "object" && !!moduleConfig,
            `invalid '${optionPath}': not a 'string' or an 'object'`
          );

          const { name, indexFile, ...unknownModuleConfigProperties } =
            /** @type {ModuleConfig} */ (moduleConfig);

          assert.ok(
            typeof name == "string",
            `invalid '${optionPath}.name': not a 'string'`
          );
          assert.ok(!!name, `invalid '${optionPath}.name': value is empty`);

          if (indexFile != null) {
            assert.ok(
              typeof indexFile == "string",
              `invalid '${optionPath}.indexFile': not a 'string'`
            );
            assert.ok(
              !!indexFile,
              `invalid '${optionPath}.indexFile': value is empty`
            );
          }

          if (indexFile != null && indexFile !== name) {
            const [nameID] = name.split("/");
            const [indexFileID] = indexFile.split("/");

            assert.ok(
              nameID === indexFileID,
              `invalid '${optionPath}': '${indexFile}' not belong to '${name}' package`
            );
          }

          const unknownModuleConfigPropertyNames = Object.keys(
            unknownModuleConfigProperties
          );
          assert.ok(
            !unknownModuleConfigPropertyNames.length,
            `invalid '${optionPath}': has unknown properties ${unknownModuleConfigPropertyNames.join(
              ", "
            )}`
          );

          return [name, indexFile];
        })
      )
    );

    pluginOptionsCache.set(opts, pluginOptions);

    return pluginOptions;
  }

  /**
   * @param {Map<string, string | undefined>} modules
   * @protected
   */
  constructor(modules) {
    this.modules = modules;
  }
}

module.exports = PluginOptions;
