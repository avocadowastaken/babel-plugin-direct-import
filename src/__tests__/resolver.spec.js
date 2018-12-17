"use strict";

const path = require("path");
const { resolveFilename } = require("../resolver");

describe("resolver", () => {
  describe("resolveFilename", () => {
    it("should resolve package path", () => {
      const filePath = resolveFilename("lodash");

      expect(filePath).toContain(
        path.join("node_modules", "lodash", "lodash.js")
      );
    });

    it("should throw errors from `Module` package", () => {
      expect(() => resolveFilename(null)).toThrowErrorMatchingSnapshot();
    });

    it("should not throw when module is not installed", () => {
      const fn = jest.spyOn(console, "warn").mockImplementation();

      const filePath = resolveFilename("foo");

      expect(filePath).toBeNull();
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith(
        "babel-plugin-direct-import: Cannot find module 'foo'"
      );

      fn.mockRestore();
    });
  });
});
