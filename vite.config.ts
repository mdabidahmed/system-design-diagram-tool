import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // GitHub Pages serves this repo from /system-design-diagram-tool/, not
  // the domain root — without this, the built bundle would reference
  // absolute paths like /assets/... that 404 once deployed there.
  base: "/system-design-diagram-tool/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
