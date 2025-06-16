import { createServerFn } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"
import { authMiddleware } from "./middleware"

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
