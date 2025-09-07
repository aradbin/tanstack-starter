/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { head } from '@/lib/variables'
import { ThemeProvider } from '@/providers/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  head: () => head,
  component: RootComponent,
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
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster richColors position="bottom-center" />
          </QueryProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}