// biome-ignore lint/nursery/noNodejsModules: <explanation>
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import EnvironmentPlugin from "vite-plugin-environment";

const hash = execSync("git rev-parse --short HEAD").toString().trim();

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  plugins: [
    solidPlugin(),
    EnvironmentPlugin({
      commitHash: hash,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
