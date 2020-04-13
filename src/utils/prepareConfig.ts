import { assert } from './asserts';

export interface PluginConfig {
  name: string;
  indexFile?: null | string;
}

export function prepareConfig(
  args: string | PluginConfig | Array<string | PluginConfig>,
): PluginConfig[] {
  const configs = Array.isArray(args) ? args : [args];

  return configs.map((options) => {
    if (typeof options === 'string') {
      return { name: options };
    }

    const { name, indexFile, ...unknownOptions } = options;

    assert(typeof name === 'string', '{ name } expected to be a string');
    assert(!!name, '{ name } is empty');

    if (indexFile != null) {
      assert(
        typeof indexFile === 'string',
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
      unknownOptionsKeys.length === 0,
      'contains unknown keys { %s }',
      unknownOptionsKeys.join(', '),
    );

    return options;
  });
}
