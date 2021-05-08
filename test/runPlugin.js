"use strict";

const babel = require("@babel/core");
const plugin = require("../lib/plugin");

/** @type {Set<string>} */
const transformed = new Set();

expect.addSnapshotSerializer({
  test(value) {
    return transformed.has(value);
  },
  serialize(value) {
    return value.trim();
  },
});

/**
 * @param {string} input
 * @param {unknown[]} modules
 * @returns {string}
 */
module.exports = function runPlugin(input, modules) {
  const result = babel.transformSync(input, {
    plugins: [[plugin, { modules }]],
  });
  if (!result?.code) return "";
  transformed.add(result.code);
  return result.code;
};
