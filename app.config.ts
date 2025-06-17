import { defineConfig } from "@tanstack/react-start/config"
import nitroCloudflareBindings from "nitro-cloudflare-dev"
import { cloudflare } from "unenv"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    preset: "cloudflare-module",
    unenv: cloudflare,
    modules: [nitroCloudflareBindings],
  },
})
