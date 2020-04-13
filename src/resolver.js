'use strict';

const resolve = require('resolve');
const { format } = require('util');

/**
 * Resolve module file.
 *
 * @param {String} fileName
 * @param {String} basedir
 * @returns {String|null}
 */
function resolveFilename(fileName, basedir = process.cwd()) {
  try {
    return resolve.sync(fileName, { basedir });
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.warn(format('babel-plugin-direct-import: %s', error.message));

      return null;
    }

    throw error;
  }
}

module.exports = { resolveFilename };
