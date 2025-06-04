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
import { authRoutes } from "@/lib/variables"
import appCss from "@/styles/globals.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  beforeLoad: async () => {
    const user = await getUser()
    return { user }
  },
  loader: ({ context, location }) => {
    console.log("context", context)
    const isAuthRoute = authRoutes.includes(location.pathname)
    const isLoggedIn = !!context?.user
    const hasMembers = !!context?.user?.members?.length

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
      !hasMembers &&
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
  return (
    <html className="dark" lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased overscroll-none">
        <ThemeProvider defaultTheme="system" storageKey="mode">
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
