import { transformSync } from '@babel/core';
import plugin from '../index';
import { PluginConfig } from '../utils/prepareConfig';

const cache = new Set<string>();

expect.addSnapshotSerializer({
  test(value) {
    return cache.has(value);
  },
  serialize(value) {
    return value as string;
  },
});

export function runPlugin(
  input: string,
  modules: Array<string | PluginConfig>,
) {
  const result = transformSync(input, { plugins: [[plugin(), { modules }]] });
  const code = result?.code;

  if (code) {
    cache.add(code);
  }

  return code;
}
