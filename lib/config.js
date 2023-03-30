"use strict";

const assert = require("node:assert");

/**
 * @typedef {object} PluginConfig
 * @property {Set<string>} modules
 */

/**
 * @param {object} options
 * @returns {PluginConfig}
 */
module.exports.parseConfig = function parseConfig(options) {
  assert.ok("modules" in options, "invalid 'options.modules': not defined");

  const { modules, ...unknownPluginOptions } = options;
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

  /** @type {PluginConfig} */
  const config = { modules: new Set() };
  for (const [idx, id] of modules.entries()) {
    const optionPath = `options.modules[${idx}]`;
    assert.ok(typeof id == "string", `invalid '${optionPath}': not a 'string'`);
    assert.ok(!!id.length, `invalid '${optionPath}': value is empty`);
    config.modules.add(id);
  }
  return config;
};
