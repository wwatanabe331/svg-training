// Reactプラグインを追加することで、ViteがJSXファイルを正しく扱えるようになる
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});