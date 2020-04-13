'use strict';

const { format } = require('util');

const CONFIG_KEYS = new Set(['name', 'indexFile', 'indexFileContent']);

function getUnknownKeys(options) {
  return Object.keys(options)
    .sort()
    .filter((key) => !CONFIG_KEYS.has(key));
}

function castArray(value) {
  return Array.isArray(value) ? value : [value];
}

function prepareConfig(args) {
  return castArray(args).map((options) => {
    if (typeof options === 'string') {
      return {
        name: options,
        indexFile: null,
        indexFileContent: null,
      };
    }

    const { name, indexFile, indexFileContent } = options;
    const unknownKeys = getUnknownKeys(options);

    const config = {};

    if (unknownKeys.length > 0) {
      throw new Error(
        format(
          'babel-plugin-direct-import: contains unknown keys { %s }',
          unknownKeys.join(', '),
        ),
      );
    }

    if (typeof name !== 'string') {
      throw new Error(
        'babel-plugin-direct-import: { name } expected to be a string',
      );
    }

    if (!name) {
      throw new Error('babel-plugin-direct-import: { name } is empty');
    }

    config.name = name;

    if (indexFile != null) {
      if (typeof indexFile !== 'string') {
        throw new Error(
          'babel-plugin-direct-import: { indexFile } expected to be a string',
        );
      }

      if (!indexFile) {
        throw new Error('babel-plugin-direct-import: { indexFile } is empty');
      }

      config.indexFile = indexFile;
    }

    if (
      indexFile != null &&
      config.indexFile !== config.name &&
      config.indexFile.split('/')[0] !== config.name.split('/')[0]
    ) {
      throw new Error(
        format(
          'babel-plugin-direct-import: Index file "%s" must belong to "%s" package',
          config.indexFile,
          config.name,
        ),
      );
    }

    if (indexFileContent === undefined) {
      config.indexFileContent = null;
    } else {
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

      config.indexFileContent = indexFileContent;
    }

    return config;
  });
}

module.exports = { prepareConfig };
