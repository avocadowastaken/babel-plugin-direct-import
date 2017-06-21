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
        indexFile: "lodash/index"
      });

      expect(result).toEqual({
        exports: {},
        name: "lodash",
        indexFile: "lodash/index"
      });
    });

    it("should scan named import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import { bar as _bar } from './bar';",
          "export { _bar as bar };"
        ].join("\n")
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            local: "bar",
            exported: "bar",
            source: "foo/bar"
          }
        }
      });
    });

    it("should scan default import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar from './bar';",
          "export { _bar as bar };"
        ].join("\n")
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar"
          }
        }
      });
    });

    it("should scan default with named import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import _bar, { baz as _baz } from './bar';",
          "export { _bar as bar, _baz as baz };"
        ].join("\n")
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar"
          },
          baz: {
            local: "baz",
            exported: "baz",
            source: "foo/bar"
          }
        }
      });
    });

    it("should ignore namespace import declarations", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: [
          "import * as _bar from './bar';",
          "export { _bar as bar };"
        ].join("\n")
      });

      expect(result).toEqual({
        exports: {},
        name: "foo",
        indexFile: "foo/index"
      });
    });

    it("should scan named export declarations with source", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: "export { bar } from './bar';"
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "bar",
            source: "foo/bar"
          }
        }
      });
    });

    it("should scan default export declarations with source", () => {
      const result = fulfillConfigExports({
        name: "foo",
        indexFile: "foo/index",
        indexFileContent: "export { default as bar } from './bar';"
      });

      expect(result).toEqual({
        name: "foo",
        indexFile: "foo/index",
        exports: {
          bar: {
            exported: "bar",
            local: "default",
            source: "foo/bar"
          }
        }
      });
    });
  });
});
