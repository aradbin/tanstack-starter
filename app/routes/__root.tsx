import { scan } from "react-scan";
import type { ReactNode } from "react"
import { ThemeProvider } from "@/providers/theme-provider"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router"

import { getUser } from "@/lib/auth/functions"
import { authRoutes, head } from "@/lib/variables"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  head: () => head,
  component: RootComponent,
  beforeLoad: async () => {
    try {
      let user = await getUser()
      return { user }
    } catch (_) {
      return { user: null }
    }
  },
  loader: ({ context, location }) => {
    const isAuthRoute = authRoutes.includes(location.pathname)
    const isLoggedIn = !!context?.user
    const hasOrganizations = !!context?.user?.organizations?.length

    if (!isLoggedIn && !isAuthRoute) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }

    if (isLoggedIn && isAuthRoute) {
      throw redirect({
        to: "/",
      })
    }

    if (
      isLoggedIn &&
      !isAuthRoute &&
      !hasOrganizations &&
      location.pathname !== "/register/organization"
    ) {
      throw redirect({
        to: "/register/organization",
      })
    }
  },
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  scan({
    enabled: false,
  });
  return (
    <html className="dark" lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased overscroll-none">
        <ThemeProvider defaultTheme="system" storageKey="mode">
          <QueryProvider>
            {children}
            <Toaster richColors position="bottom-center" />
          </QueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
