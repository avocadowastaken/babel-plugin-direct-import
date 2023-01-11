"use strict";

const resolve = require("resolve");

const MAIN_FIELDS = ["module", "esnext", "jsnext:main"];

/**
 * @param {resolve.PackageJSON} pkg
 * @returns {resolve.PackageJSON}
 */
function packageFilter(pkg) {
  for (const key of MAIN_FIELDS) {
    /* istanbul ignore else */
    const main = pkg[key];
    /* istanbul ignore else */
    if (typeof main === "string" && main) {
      return { ...pkg, main };
    }
  }
  /* istanbul ignore next */
  return pkg;
}

/**
 * @param {string} id
 * @param {string} [basedir]
 * @returns {string}
 */
module.exports = function resolveModule(id, basedir) {
  return resolve.sync(id, { basedir, packageFilter });
};
