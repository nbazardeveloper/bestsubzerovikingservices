import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  server: {
    host: true,
    port: 8080,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Keep a single copy of React/React Query in the graph — TanStack Start's
    // server + client bundles can otherwise resolve two different copies and
    // break hooks (invalid hook call) or React Query's cache identity.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Prevents server-only code (Supabase service-role client, etc.) from
      // being pulled into the client bundle by accident.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Route TanStack Start's bundled server entry through src/server.ts,
      // which wraps SSR errors into a friendly error page instead of a raw 500.
      server: { entry: "server" },
    }),
    // Deploy adapter — only needed when producing a build, not during `vite dev`.
    ...(command === "build" ? [nitro({ preset: "cloudflare-module" })] : []),
    viteReact(),
  ],
}));
