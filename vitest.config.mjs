import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.js"],
    snapshotFormat: { escapeString: false },
    coverage: { reporter: ["html", "lcov", "text"] },
  },
});
