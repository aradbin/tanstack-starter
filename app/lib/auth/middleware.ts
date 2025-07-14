import { createMiddleware } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { data } = await authClient.getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  if (!data) {
    throw new Error("Session Timeout. Please login again")
  }
  
  return await next({
    context: data,
  })
})

export const authOrgMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ context, next }) => {
    if (!context?.session?.activeOrganizationId) {
      throw new Error("No active organization found. Please select an organization")
    }

    return await next({
      context: {
        ...context,
        session: {
          ...context.session,
          activeOrganizationId: context?.session?.activeOrganizationId,
        },
      },
    })
  })