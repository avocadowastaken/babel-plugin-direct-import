const fs = require("fs");
const path = require("path");
const util = require("util");
const babel = require("babel-core");
const plugin = require("../src/index");
const { fulfillConfigExports } = require("../src/mapper");

const fp = require("lodash/fp");

const makeRaw = string => ({ [Symbol.for("raw")]: string });

const safeReadDir = dir => {
  try {
    return fs.readdirSync(dir).map(x => path.join(dir, x));
  } catch (e) {
    return [];
  }
};

const getFixtures = fp.flow(
  x => [[x, "error"], [x, "transform"]],
  fp.map(([x, dir]) => [dir, safeReadDir(path.join(x, dir))]),
  fp.fromPairs
);

function runSpec(dir, spec) {
  const [version, pkg] = dir.split(path.sep).reverse();

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
    }
  });
}

function runTransformSpec(dir) {
  runSpec(dir, {
    title: "Transform: %s",
    run(transformConfig) {
      const {
        error: errorFixtures,
        transform: transformFixtures
      } = getFixtures(path.join(dir, "__fixtures__"));

      errorFixtures.forEach(filename => {
        it(`should throw with: "${path.basename(filename)}"`, () => {
          const content = fs.readFileSync(filename, "utf-8");

          expect(() =>
            babel.transform(content, { plugins: [[plugin, transformConfig]] })
          ).toThrowErrorMatchingSnapshot();
        });
      });

      transformFixtures.forEach(filename => {
        it(`should transform with: "${path.basename(filename)}"`, () => {
          const content = fs.readFileSync(filename, "utf-8");

          const result = babel.transform(content, {
            plugins: [[plugin, transformConfig]]
          });

          expect(
            makeRaw(`${content}${"~".repeat(80)}\n${result.code}`)
          ).toMatchSnapshot();
        });
      });
    }
  });
}

module.exports = { runMappingSpec, runTransformSpec };
