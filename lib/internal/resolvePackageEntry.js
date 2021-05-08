"use strict";

const path = require("path");
const assert = require("assert");
const resolveModule = require("./resolveModule");

/**
 * @param {string} name
 * @param {string} [indexFile]
 * @returns {string}
 */
module.exports = function resolvePackageEntry(name, indexFile) {
  if (!indexFile) {
    const entry = resolveModule(name);

    assert.ok(entry, `failed to find 'indexFile' of '${name}'.`);

    return entry;
  }

  const pkgJSONPath = resolveModule(`${name}/package.json`);

  assert.ok(pkgJSONPath, `failed to resolve 'package.json' for '${name}'.`);

  const pkgDir = path.dirname(pkgJSONPath);
  const entry = resolveModule(path.join(pkgDir, indexFile));

  assert.ok(entry, `failed to resolve 'indexFile' specified for '${name}'.`);

  return entry;
};
