const { resolveFilename } = require("../resolver");

describe("resolver", () => {
  describe("resolveFilename", () => {
    it("should resolve package path", () => {
      const filePath = resolveFilename("lodash");

      expect(filePath).toContain("node_modules/lodash/lodash.js");
    });

    it("should throw errors from `Module` package", () => {
      expect(() => resolveFilename(null)).toThrowErrorMatchingSnapshot();
    });

    it("should not throw when module is not installed", () => {
      const fn = jest.fn();
      const warn = console.warn;

      console.warn = fn;

      const filePath = resolveFilename("foo");

      expect(filePath).toBeNull();
      expect(fn.mock.calls).toMatchSnapshot();

      console.warn = warn;
    });
  });
});
