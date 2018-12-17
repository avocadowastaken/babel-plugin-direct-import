"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const babel = require("babel-core");
const plugin = require("../src/index");
const { fulfillConfigExports } = require("../src/mapper");

const RAW = Symbol("raw");

function makeRaw(input, output) {
  return {
    [RAW]: [input, "~".repeat(80), "\n", output].join(""),
  };
}

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir).map(x => path.join(dir, x));
  } catch (e) {
    return [];
  }
}

function getFixtures(testDir) {
  return {
    error: safeReadDir(path.join(testDir, "error")),
    transform: safeReadDir(path.join(testDir, "transform")),
  };
}

function runSpec(dir, spec) {
  const [version, pkg] = dir.split(path.sep).reverse();

  expect.addSnapshotSerializer({
    print(x) {
      return x[RAW];
    },
    test(x) {
      return x && typeof x[RAW] === "string";
    },
  });

  describe(util.format(spec.title, `${pkg}@${version}`), () => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const configs = require(path.join(dir, "config.json"));

    const transformConfig = configs.map(({ name, indexFile }) => {
      const indexFileContent = fs.readFileSync(
        require.resolve(path.join(dir, indexFile.slice(pkg.length))),
        "utf-8"
      );

      return { name, indexFile, indexFileContent };
    });

    spec.run(transformConfig);
  });
}

function runMappingSpec(dir) {
  runSpec(dir, {
    title: "Fulfill mappings for: %s",
    run(transformConfig) {
      transformConfig.forEach(config => {
        it(`should fulfill exports for "${config.indexFile}"`, () => {
          expect(fulfillConfigExports(config)).toMatchSnapshot();
        });
      });
    },
  });
}

function transform(content, transformConfig) {
  return babel.transform(content, {
    plugins: ["syntax-flow", [plugin, transformConfig]],
  });
}

function runTransformSpec(dir) {
  runSpec(dir, {
    title: "Transform: %s",
    run(transformConfig) {
      const {
        error: errorFixtures,
        transform: transformFixtures,
      } = getFixtures(path.join(dir, "__fixtures__"));

      errorFixtures.forEach(filename => {
        it(`should warn with: "${path.basename(filename)}"`, () => {
          const { warn } = console;

          console.warn = jest.fn();

          const content = fs.readFileSync(filename, "utf-8");
          const result = transform(content, transformConfig);

          expect(result.code.trim()).toBe(content.trim());
          expect(console.warn).toBeCalled();

          console.warn.mock.calls.forEach(x => {
            expect(x[0]).toMatchSnapshot();
          });

          console.warn = warn;
        });
      });

      transformFixtures.forEach(filename => {
        it(`should transform with: "${path.basename(filename)}"`, () => {
          const content = fs.readFileSync(filename, "utf-8");
          const result = transform(content, transformConfig);

          expect(makeRaw(content, result.code)).toMatchSnapshot();
        });
      });
    },
  });
}

module.exports = { runMappingSpec, runTransformSpec };
