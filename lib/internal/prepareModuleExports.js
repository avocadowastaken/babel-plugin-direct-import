'use strict';

const assert = require('assert');

/**
 * @typedef {object} ModuleConfig
 * @property {string} name
 * @property {string} [indexFile]
 */

/**
 * @param {unknown[]} input
 * @returns {ModuleConfig[]}
 */
module.exports = function prepareModuleExports(input) {
  /** @type {ModuleConfig[]} */
  const configs = [];

  for (const config of input) {
    if (typeof config == 'string') {
      configs.push({ name: config });
    } else if (typeof config == 'object' && config) {
      const {
        name,
        indexFile,
        ...unknownOptions
      } = /** @type {ModuleConfig} */ (config);

      assert.ok(typeof name == 'string', '{ name } expected to be a string');
      assert.ok(name, '{ name } is empty');

      if (indexFile != null) {
        assert.ok(
          typeof indexFile == 'string',
          '{ indexFile } expected to be a string',
        );
        assert.ok(indexFile, '{ indexFile } is empty');
      }

      if (indexFile != null && indexFile !== name) {
        const [nameID] = name.split('/');
        const [indexFileID] = indexFile.split('/');

        assert.ok(
          nameID === indexFileID,
          `index file '${indexFile}' must belong to '${name}' package`,
        );
      }

      const unknownOptionsKeys = Object.keys(unknownOptions);
      assert.ok(
        !unknownOptionsKeys.length,
        `contains unknown keys { ${unknownOptionsKeys.join(', ')} }`,
      );

      configs.push({ name, indexFile });
    }
  }

  return configs;
};
