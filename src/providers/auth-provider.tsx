import LoadingComponent from "@/components/common/loading-component";
import { getUser } from "@/lib/auth/functions";
import { organizations, users } from "@/lib/db/schema";
import { AnyType } from "@/lib/types";
import { authRoutes } from "@/lib/variables";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect } from "react";

type AuthStateType = {
  user: typeof users.$inferSelect & {
    activeOrganizationId: string,
    activeOrganization: typeof organizations.$inferSelect & {
      metadata: AnyType
    } | null,
    organizations: typeof organizations.$inferSelect[] | null | undefined
  } | null | undefined,
  refetch: () => Promise<void>
}

const initialState: AuthStateType = {
  user: null,
  refetch: () => Promise.resolve()
}

const AuthContext = createContext<AuthStateType>(initialState)

export function AuthProvider({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()

  const { data: user, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['auth'],
    queryFn: () => getUser()
  })

  useEffect(() => {
    if (isLoading || isFetching) return

    const location = window.location
    const isAuthRoute = authRoutes.includes(location.pathname)
    const isLoggedIn = !!user
    const hasOrganizations = !!user?.organizations?.length

    if (!isLoggedIn && !isAuthRoute) {
      router.navigate({
        to: "/login",
        search: { redirect: location.href },
      })
    } else if (isLoggedIn && isAuthRoute) {
      router.navigate({ to: "/" })
    } else if (
      isLoggedIn &&
      !isAuthRoute &&
      !hasOrganizations &&
      location.pathname !== "/register/organization"
    ) {
      router.navigate({ to: "/register/organization" })
    }
  }, [isFetching, isLoading, user, error, router])

  if (isLoading || isFetching) {
    return <LoadingComponent isLoading={isLoading || isFetching} />
  }

  return (
    <AuthContext.Provider value={{
      user,
      refetch
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined){
    throw new Error("useAuth must be used within a AuthProvider")
  }

  return context
}
