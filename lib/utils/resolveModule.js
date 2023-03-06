"use strict";

const fs = require("node:fs");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");

const resolver = ResolverFactory.createResolver({
  useSyncFileSystemCalls: true,
  extensions: [".mjs", ".js", ".json"],
  mainFields: ["module", "esnext", "jsnext:main"],
  fileSystem: new CachedInputFileSystem(fs, 4_000),
});

/**
 * @param {string} id
 * @param {string} [directory]
 * @returns {string}
 */
module.exports = function resolveModule(id, directory = __dirname) {
  const result = resolver.resolveSync({}, directory, id);
  if (!result) {
    throw new Error(`Can't resolve '${id}' in '${directory}'`);
  }
  return result;
};
