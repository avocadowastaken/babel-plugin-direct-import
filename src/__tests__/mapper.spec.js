const fse = require("fs-extra");
const path = require("path");
const { fulfillConfigExports } = require("../mapper");

describe("mapper", () => {
  describe("fulfillConfigExports", () => {
    it("should return same config if it has exports", () => {
      const config = { name: "foo", indexFile: "foo/index", exports: {} };

      expect(fulfillConfigExports(config)).toBe(config);
    });

    it("should resolve and load `indexFile`", () => {
      const result = fulfillConfigExports({
        name: "lodash",
        indexFile: "lodash/index",
      });

      expect(result).toEqual({
        exports: {},
        name: "lodash",
        indexFile: "lodash/index",
      });
    });

    it("should read `indexFile` from the `module` field in package.json", () => {
      const dummyModulePath = path.resolve(
        __dirname,
        "..",
        "..",
        "node_modules",
        "__dummy-module"
      );
      fse.removeSync(dummyModulePath);
      fse.mkdirpSync(dummyModulePath);
      fse.writeFileSync(
        path.join(dummyModulePath, "package.json"),
        JSON.stringify({
          module: "./index.es.js",
        }),
        "utf-8"
      );
      fse.writeFileSync(
        path.join(dummyModulePath, "index.es.js"),
        "export { default as dummy } from './dummy'",
        "utf-8"
      );
      fse.writeFileSync(
        path.join(dummyModulePath, "dummy.js"),
        "export default 'foo'",
        "utf-8"
      );

      const result = fulfillConfigExports({
        name: "__dummy-module",
      });

      expect(result).toEqual({
        exports: {
          dummy: {
            local: "default",
            exported: "dummy",
            source: "__dummy-module/dummy",
          },
        },
        name: "__dummy-module",
        indexFile: "__dummy-module/index.es.js",
      });

      fse.removeSync(dummyModulePath);
    });

    it("should read `indexFile` from the `jsnext:main` field in package.json", () => {
      const dummyModulePath = path.resolve(
        __dirname,
        "..",
        "..",
        "node_modules",
        "__dummy-module"
      );
      fse.removeSync(dummyModulePath);
      fse.mkdirpSync(dummyModulePath);
      fse.writeFileSync(
        path.join(dummyModulePath, "package.json"),
        JSON.stringify({
          "jsnext:main": "./index.es.js",
        }),
        "utf-8"
      );
      fse.writeFileSync(
        path.join(dummyModulePath, "index.es.js"),
        "export { default as dummy } from './dummy'",
        "utf-8"
      );
      fse.writeFileSync(
        path.join(dummyModulePath, "dummy.js"),
        "export default 'foo'",
        "utf-8"
      );

      const result = fulfillConfigExports({
        name: "__dummy-module",
      });

      expect(result).toEqual({
        exports: {
          dummy: {
            local: "default",
            exported: "dummy",
            source: "__dummy-module/dummy",
          },
        },
        name: "__dummy-module",
        indexFile: "__dummy-module/index.es.js",
      });

      fse.removeSync(dummyModulePath);
    });

    it("should throw if no `indexFile` could be found", () => {
      const dummyModulePath = path.resolve(
        __dirname,
        "..",
        "..",
        "node_modules",
        "__dummy-module"
      );
      fse.removeSync(dummyModulePath);
      fse.mkdirpSync(dummyModulePath);
      fse.writeFileSync(
        path.join(dummyModulePath, "package.json"),
        JSON.stringify({
          main: "./index.js",
        }),
        "utf-8"
      );

      expect(() =>
        fulfillConfigExports({
          name: "__dummy-module",
        })
      ).toThrowErrorMatchingSnapshot();

      fse.removeSync(dummyModulePath);
    });

    it("should scan named import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import { bar as _bar } from './bar';",
          "export { _bar as bar };",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            local: "bar",
            exported: "bar",
            source: "foo/bar",
          },
        },
      });
    });

    it("should scan default import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar from './bar';",
          "export { _bar as bar };",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar",
          },
        },
      });
    });

    it("should scan default with named import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar, { baz as _baz } from './bar';",
          "export { _bar as bar, _baz as baz };",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar",
          },
          baz: {
            local: "baz",
            exported: "baz",
            source: "foo/bar",
          },
        },
      });
    });

    it("should scan namespace import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import * as _bar from './bar';",
          "export { _bar as bar };",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: { bar: { exported: "bar", local: "*", source: "foo/bar" } },
      });
    });

    it("should scan named export declarations with source", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: "export { bar } from './bar';",
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "bar",
            source: "foo/bar",
          },
        },
      });
    });

    it("should scan variable exports of imports", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar, { baz as _baz } from './bar';",
          "export const bar = _bar, baz = _baz;",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: { exported: "bar", local: "default", source: "foo/bar" },
          baz: { exported: "baz", local: "baz", source: "foo/bar" },
        },
      });
    });

    it("should ignore not imported variable exports", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar from './bar';",
          "export const bar = _bar;",
          "export const baz = bar;",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: { exported: "bar", local: "default", source: "foo/bar" },
        },
      });
    });

    it("should ignore function exports", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar from './bar';",
          "export const bar = _bar;",
          "export function baz() {}",
        ].join("\n"),
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: { exported: "bar", local: "default", source: "foo/bar" },
        },
      });
    });

    it("should scan default export declarations with source", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: "export { default as bar } from './bar';",
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar",
          },
        },
      });
    });
  });
});
