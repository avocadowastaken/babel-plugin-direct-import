import { format } from 'util';

export interface PluginConfig {
  name: string;
  indexFile?: null | string;
  indexFileContent?: null | string;
}

export function prepareConfig(
  args: string | PluginConfig | Array<string | PluginConfig>,
): PluginConfig[] {
  const configs = Array.isArray(args) ? args : [args];

  return configs.map((options) => {
    if (typeof options === 'string') {
      return { name: options };
    }

    const { name, indexFile, indexFileContent, ...unknownOptions } = options;

    if (typeof name !== 'string') {
      throw new Error(
        'babel-plugin-direct-import: { name } expected to be a string',
      );
    } else if (!name) {
      throw new Error('babel-plugin-direct-import: { name } is empty');
    }

    if (indexFile != null) {
      if (typeof indexFile !== 'string') {
        throw new Error(
          'babel-plugin-direct-import: { indexFile } expected to be a string',
        );
      }

      if (!indexFile) {
        throw new Error('babel-plugin-direct-import: { indexFile } is empty');
      }
    }

    if (indexFile != null && indexFile !== name) {
      const [nameID] = name.split('/');
      const [indexFileID] = indexFile.split('/');

      if (nameID !== indexFileID) {
        throw new Error(
          format(
            "babel-plugin-direct-import: Index file '%s' must belong to '%s' package",
            indexFile,
            name,
          ),
        );
      }
    }

    if (indexFileContent != null) {
      if (typeof indexFileContent !== 'string') {
        throw new Error(
          'babel-plugin-direct-import: { indexFileContent } expected to be a string',
        );
      }

      if (!indexFileContent) {
        throw new Error(
          'babel-plugin-direct-import: { indexFileContent } is empty',
        );
      }
    }

    const unknownOptionsKeys = Object.keys(unknownOptions);
    if (unknownOptionsKeys.length > 0) {
      throw new Error(
        format(
          'babel-plugin-direct-import: contains unknown keys { %s }',
          unknownOptionsKeys.join(', '),
        ),
      );
    }

    return options;
  });
}
