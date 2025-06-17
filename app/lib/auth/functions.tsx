import { createServerFn } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"
import { authMiddleware } from "./middleware"

export const signUp = (value: {
  name: string
  email: string
  password: string
}) => {
  return authClient.signUp.email(value)
}

export const signIn = (value: { email: string; password: string }) => {
  return authClient.signIn.email(value)
}

export const signInSocial = async (provider: "google") => {
  await authClient.signIn.social({
    provider,
  })
}

export const signOut = async () => {
  const { data } = await authClient.signOut()

  return data
}

export const getUser = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (context?.user) {
      const organizations = await getUserOrganizations()

      if (!context?.session?.activeOrganizationId && organizations?.length) {
        const activeOrganizationId = await setActiveOrganization(
          organizations[0].id
        )
        if (context?.session) {
          context.session.activeOrganizationId = activeOrganizationId
        }
      }

      return {
        ...context?.user,
        session: context?.session,
        organizations,
      }
    }

    return null
  })

export const createOrganization = (value: { name: string; slug: string }) => {
  return authClient.organization.create(value)
}

export const getUserOrganizations = async () => {
  const { data } = await authClient.organization.list({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  return data
}

export const setActiveOrganization = async (organizationId: string) => {
  const { data } = await authClient.organization.setActive({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
    organizationId,
  })

  return data?.id
}
