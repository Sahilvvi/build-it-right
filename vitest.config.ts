import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit tests only exercise pure modules, so the app's Vite plugins (TanStack Start, Nitro) are not loaded.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
