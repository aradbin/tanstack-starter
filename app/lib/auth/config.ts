import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, customSession, organization } from "better-auth/plugins"
import { reactStartCookies } from "better-auth/react-start"

import { db } from "@/lib/db"
import {
  accounts,
  invitations,
  members,
  organizations,
  sessions,
  users,
  verifications,
} from "@/lib/db/schema"

import "dotenv/config"

export const auth = betterAuth({
  appName: "TanStack Starter",
  baseURL: import.meta.env.VITE_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      organization: organizations,
      member: members,
      invitation: invitations,
    },
  }),
  usePlural: true,
  plugins: [admin(), organization(), reactStartCookies()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // })
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    cookiePrefix: "auth",
  },
  trustedOrigins: [
    // "http://localhost:3000",
    // "https://tanstack-starter.aradworkspace.workers.dev",
  ],
  session: {
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 5 * 60, // 5 minutes
    // },
  },
})
