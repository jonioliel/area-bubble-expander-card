import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/area-bubble-expander-card.ts",
      formats: ["es"],
      fileName: () => "area-bubble-expander-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
  },
});
