"use strict";

const resolve = require("resolve");

/**
 * @param {string} fileName
 * @param {string} [basedir]
 * @returns {null | string}
 */
module.exports = function resolveModule(fileName, basedir) {
  try {
    return resolve.sync(fileName, {
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
};
