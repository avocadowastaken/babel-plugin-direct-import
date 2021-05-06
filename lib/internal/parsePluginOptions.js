"use strict";

const assert = require("assert");

/**
 * @typedef {object} ModuleConfig
 * @property {string} name
 * @property {string} [indexFile]
 */

/**
 * @typedef {object} PluginOptions
 * @property {ModuleConfig[]} modules
 */

/**
 * @param {import("@babel/core").PluginOptions} pluginOptions
 * @returns {PluginOptions}
 */
module.exports = function parsePluginOptions(pluginOptions) {
  assert.ok(
    Object.prototype.toString.call(pluginOptions) === "[object Object]",
    "invalid 'options': not an 'object'"
  );

  const {
    modules,
    ...unknownPluginOptions
  } = /** @type {{ modules?: unknown }} */ (pluginOptions);

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

  return {
    modules: modules.map((moduleConfig, idx) => {
      const errorPath = `options.modules[${idx}]`;

      if (typeof moduleConfig == "string") {
        assert.ok(
          !!moduleConfig.length,
          `invalid '${errorPath}': value is empty`
        );

        return { name: moduleConfig };
      }

      assert.ok(
        typeof moduleConfig == "object" && !!moduleConfig,
        `invalid '${errorPath}': not a 'string' or an 'object'`
      );

      const {
        name,
        indexFile,
        ...unknownModuleConfigProperties
      } = /** @type {ModuleConfig} */ (moduleConfig);

      assert.ok(
        typeof name == "string",
        `invalid '${errorPath}.name': not a 'string'`
      );
      assert.ok(!!name, `invalid '${errorPath}.name': value is empty`);

      if (indexFile != null) {
        assert.ok(
          typeof indexFile == "string",
          `invalid '${errorPath}.indexFile': not a 'string'`
        );
        assert.ok(
          !!indexFile,
          `invalid '${errorPath}.indexFile': value is empty`
        );
      }

      if (indexFile != null && indexFile !== name) {
        const [nameID] = name.split("/");
        const [indexFileID] = indexFile.split("/");

        assert.ok(
          nameID === indexFileID,
          `invalid '${errorPath}': '${indexFile}' not belong to '${name}' package`
        );
      }

      const unknownModuleConfigPropertyNames = Object.keys(
        unknownModuleConfigProperties
      );
      assert.ok(
        !unknownModuleConfigPropertyNames.length,
        `invalid '${errorPath}': has unknown properties ${unknownModuleConfigPropertyNames.join(
          ", "
        )}`
      );

      return { name, indexFile };
    }),
  };
};
