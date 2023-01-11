"use strict";

const assert = require("assert");

/**
 * @param {object} options
 * @returns {{ modules: Set<string> }}
 */
module.exports = function parseOptions(options) {
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

  /** @type {Set<string>} */
  const modulesSet = new Set();
  for (const [idx, id] of modules.entries()) {
    const optionPath = `options.modules[${idx}]`;
    assert.ok(typeof id == "string", `invalid '${optionPath}': not a 'string'`);
    assert.ok(!!id.length, `invalid '${optionPath}': value is empty`);
    modulesSet.add(id);
  }
  return { modules: modulesSet };
};
