import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Build for Vercel instead of the default Cloudflare Workers target.
  nitro: {
    preset: "vercel",
  },
});
