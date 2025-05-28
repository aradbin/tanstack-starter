import "dotenv/config"

import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./app/lib/db/drizzle",
  schema: "./app/lib/db/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
