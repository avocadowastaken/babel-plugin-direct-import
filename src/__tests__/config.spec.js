const { prepareConfig } = require("../config");

describe("config", () => {
  describe("prepareConfig", () => {
    it("should throw when for unknown keys", () => {
      expect(() =>
        prepareConfig({ foo: "bar", baz: 10 })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should not throw when given only a name as string", () => {
      expect(() => prepareConfig("lodash")).not.toThrow();
    });

    it("should throw when `name` is not a string", () => {
      expect(() => prepareConfig({ name: 10 })).toThrowErrorMatchingSnapshot();
      expect(() => prepareConfig({ name: {} })).toThrowErrorMatchingSnapshot();
      expect(() => prepareConfig({ name: [] })).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: null })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should throw when `name` is an empty string", () => {
      expect(() => prepareConfig({ name: "" })).toThrowErrorMatchingSnapshot();
    });

    it("should throw when `indexFile` is not a string", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: 10 })
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: {} })
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: [] })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should not throw when `indexFile` is null or undefined", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: null })
      ).not.toThrow();
      expect(() => prepareConfig({ name: "lodash" })).not.toThrow();
    });

    it("should throw when `indexFile` is an empty string", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: "" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should throw when `indexFile` does not belongs to package", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFile: "lodash-es/index" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should throw when `indexFileContent` is not a string", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFileContent: 10 })
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: "lodash", indexFileContent: {} })
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: "lodash", indexFileContent: [] })
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        prepareConfig({ name: "lodash", indexFileContent: null })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should throw when `indexFileContent` is an empty string", () => {
      expect(() =>
        prepareConfig({ name: "lodash", indexFileContent: "" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("should always return array", () => {
      const config = prepareConfig({ name: "lodash" });

      expect(Array.isArray(config)).toBe(true);
    });

    it("should create normalized config", () => {
      expect(
        prepareConfig({ name: "lodash", indexFile: "lodash/index" })
      ).toEqual([
        { name: "lodash", indexFile: "lodash/index", indexFileContent: null },
      ]);

      expect(prepareConfig("material-ui")).toEqual([
        { name: "material-ui", indexFile: null, indexFileContent: null },
      ]);
    });
  });
});
