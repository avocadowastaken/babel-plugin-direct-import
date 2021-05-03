import { assert } from './asserts';

export interface PluginConfig {
  name: string;
  indexFile?: null | string;
}

export function prepareConfig(args: unknown): PluginConfig[] {
  const configs: PluginConfig[] = [];

  for (const config of (Array.isArray(args) ? args : [args]) as unknown[]) {
    if (typeof config == 'string') {
      configs.push({ name: config });
    } else if (typeof config == 'object' && config) {
      const { name, indexFile, ...unknownOptions } = config as PluginConfig;

      assert(typeof name == 'string', '{ name } expected to be a string');
      assert(!!name, '{ name } is empty');

      if (indexFile != null) {
        assert(
          typeof indexFile == 'string',
          '{ indexFile } expected to be a string',
        );
        assert(!!indexFile, '{ indexFile } is empty');
      }

      if (indexFile != null && indexFile !== name) {
        const [nameID] = name.split('/');
        const [indexFileID] = indexFile.split('/');

        assert(
          nameID === indexFileID,
          "index file '%s' must belong to '%s' package",
          indexFile,
          name,
        );
      }

      const unknownOptionsKeys = Object.keys(unknownOptions);
      assert(
        !unknownOptionsKeys.length,
        'contains unknown keys { %s }',
        unknownOptionsKeys.join(', '),
      );

      configs.push({ name, indexFile });
    }
  }

  return configs;
}
