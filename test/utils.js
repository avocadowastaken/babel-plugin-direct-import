import babel, { parse, types } from "@babel/core";
import { expect } from "vitest";
import Parser from "../lib/internal/Parser.js";
import plugin from "../lib/plugin.js";

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
export function runPlugin(input, modules) {
  const result = babel.transformSync(input, {
    plugins: [[plugin, { modules }]],
  });
  if (!result?.code) return "";
  transformed.add(result.code);
  return result.code;
}

const parser = new Parser(parse, types);

/**
 * @param {string} entryId
 * @returns {unknown[]}
 */
export function testExports(entryId) {
  /** @type {[id: string, internalID: string, source: string][]} */
  const result = [];

  for (const [id, { source, internalID }] of parser.getDependenciesMap(
    entryId
  )) {
    result.push([id, internalID, source]);
  }

  return result.sort(([, , a], [, , b]) => a.localeCompare(b));
}
