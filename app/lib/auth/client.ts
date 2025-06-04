import {
  adminClient,
  customSessionClient,
  organizationClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { auth } from "@/lib/auth/config"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [
    adminClient(),
    organizationClient(),
    customSessionClient<typeof auth>(),
  ],
})
