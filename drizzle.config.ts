import "dotenv/config"

import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./src/lib/db/drizzle",
  schema: "./src/lib/db/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
