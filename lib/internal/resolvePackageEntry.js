"use strict";

const assert = require("assert");
const resolveModule = require("./resolveModule");

/**
 * @param {string} name
 * @returns {string}
 */
module.exports = function resolvePackageEntry(name) {
  const entry = resolveModule(name);

  assert.ok(entry, `failed to find 'indexFile' of '${name}'.`);

  return entry;
};
