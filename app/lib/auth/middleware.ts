import { createMiddleware } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { data: user } = await authClient.getSession({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  return await next({
    context: {
      user,
    },
  })
})
