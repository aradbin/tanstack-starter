import LoadingComponent from "@/components/common/loading-component";
import { getUser } from "@/lib/auth/functions";
import { organizations, users } from "@/lib/db/schema";
import { authRoutes } from "@/lib/variables";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect } from "react";

type AuthStateType = {
  user: typeof users.$inferSelect & {
    activeOrganizationId: string,
    organizations: typeof organizations.$inferSelect[] | null | undefined
  } | null | undefined
}

const initialState: AuthStateType = {
  user: null
}

const AuthContext = createContext<AuthStateType>(initialState)

export function AuthProvider({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()

  const { data: user, isLoading, isFetching, error } = useQuery({
    queryKey: ['auth'],
    queryFn: () => getUser()
  })

  useEffect(() => {
    if (isLoading) return

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

  if (isFetching) {
    return <LoadingComponent isLoading={isFetching} />
  }

  return (
    <AuthContext.Provider value={{
      user
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
