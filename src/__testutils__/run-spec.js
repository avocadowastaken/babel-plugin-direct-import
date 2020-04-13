'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const babel = require('@babel/core');
const plugin = require('../index');
const { fulfillConfigExports } = require('../mapper');

const RAW = Symbol('raw');

function makeRaw(input, output) {
  return {
    [RAW]: [input, '~'.repeat(80), '\n', output].join(''),
  };
}

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir).map((x) => path.join(dir, x));
  } catch (e) {
    return [];
  }
}

function getFixtures(testDir) {
  return {
    error: safeReadDir(path.join(testDir, 'error')),
    transform: safeReadDir(path.join(testDir, 'transform')),
  };
}

function runSpec(dir, spec) {
  const [version, pkg] = dir.split(path.sep).reverse();

  expect.addSnapshotSerializer({
    print: (x) => x[RAW],
    test: (x) => x && typeof x[RAW] === 'string',
  });

  describe(util.format(spec.title, `${pkg}@${version}`), () => {
    const config = require(path.join(dir, 'config.json'));

    const modules = config.map(({ name, indexFile }) => {
      const indexFileContent = fs.readFileSync(
        require.resolve(path.join(dir, indexFile.slice(pkg.length))),
        'utf-8',
      );

      return { name, indexFile, indexFileContent };
    });

    spec.run({ modules });
  });
}

function runMappingSpec(dir) {
  runSpec(dir, {
    title: 'Fulfill mappings for: %s',
    run({ modules }) {
      modules.forEach((config) => {
        it(`should fulfill exports for "${config.indexFile}"`, () => {
          expect(fulfillConfigExports(config)).toMatchSnapshot();
        });
      });
    },
  });
}

function transform(filename, content, pluginOptions) {
  return babel.transformSync(content, {
    filename,
    plugins: ['@babel/plugin-syntax-flow', [plugin, pluginOptions]],
  });
}

function runTransformSpec(dir) {
  runSpec(dir, {
    title: 'Transform: %s',
    run(pluginOptions) {
      const {
        error: errorFixtures,
        transform: transformFixtures,
      } = getFixtures(path.join(dir, '__fixtures__'));

      errorFixtures.forEach((filename) => {
        it(`should warn with: "${path.basename(filename)}"`, () => {
          const { warn } = console;

          console.warn = jest.fn();

          const content = fs.readFileSync(filename, 'utf-8');
          const result = transform(filename, content, pluginOptions);

          expect(result.code.trim()).toBe(content.trim());
          expect(console.warn).toHaveBeenCalled();

          console.warn.mock.calls.forEach((x) => {
            expect(x[0]).toMatchSnapshot();
          });

          console.warn = warn;
        });
      });

      transformFixtures.forEach((filename) => {
        it(`should transform with: "${path.basename(filename)}"`, () => {
          const content = fs.readFileSync(filename, 'utf-8');
          const result = transform(filename, content, pluginOptions);

          expect(makeRaw(content, result.code)).toMatchSnapshot();
        });
      });
    },
  });
}

// eslint-disable-next-line jest/no-export
module.exports = { runMappingSpec, runTransformSpec };
