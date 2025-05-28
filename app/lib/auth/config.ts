import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { reactStartCookies } from "better-auth/react-start"

import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema/users"

export const auth = betterAuth({
  baseURL: import.meta.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  usePlural: true,
  plugins: [reactStartCookies()],
  emailAndPassword: {
    enabled: true,
    verifyEmail: false,
  },
})
