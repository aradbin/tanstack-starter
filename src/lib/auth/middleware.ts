import { createMiddleware } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"
import { AnyType } from "../types"
import { auth } from "./config"

export const authMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const headers: AnyType = getHeaders()

  const response = await auth.api.getSession({
    headers: headers
  })

  if (!response?.user) {
    throw new Response("Session Timeout. Please login again", { status: 401 })
  }
  
  return await next({
    context: response,
  })
})

export const authOrgMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ context, next }) => {
    if (!context?.session?.activeOrganizationId) {
      throw new Response("No active organization found. Please select an organization", { status: 400 })
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