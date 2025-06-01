import { createFileRoute, Outlet } from "@tanstack/react-router"
import { GalleryVerticalEnd } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import AuthProviders from "./-auth-providers"

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Tanstack Starter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <AuthProviders />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <Outlet />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
