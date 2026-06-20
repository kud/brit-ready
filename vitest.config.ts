import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Pure-logic unit tests run in node; the `@/` alias is resolved from tsconfig.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
