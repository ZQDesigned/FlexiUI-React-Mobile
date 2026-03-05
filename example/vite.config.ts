import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "flexiui-react-mobile": fileURLToPath(new URL("../packages/flexiui-react-mobile/src", import.meta.url)),
    },
  },
});
