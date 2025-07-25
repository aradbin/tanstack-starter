import { createServerFn } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"
import { authMiddleware } from "./middleware"
import { db } from "@/lib/db"
import { sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const signUp = async (value: {
  name: string
  email: string
  password: string
}) => {
  const { data, error } =  await authClient.signUp.email(value)

  if(data){
    return {
      ...data,
      message: 'Registration Successful'
    }
  }

  throw new Error(error?.message || "Something went wrong. Please try again.");
}

export const signIn = async (value: { email: string; password: string }) => {
  const { data, error } = await authClient.signIn.email(value)

  if(data){
    return {
      ...data,
      message: 'Login Successful'
    }
  }

  throw new Error(error?.message || "Something went wrong. Please try again.");
  
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
          await db.update(sessions).set({ activeOrganizationId: organizations[0].id }).where(eq(sessions.id, context.session.id))
          context.session.activeOrganizationId = activeOrganizationId
        }
      }

      return {
        ...context?.user,
        activeOrganizationId: context?.session?.activeOrganizationId,
        organizations,
      }
    }

    return null
  })

export const createOrganization = async (value: { name: string; slug: string }) => {
  const { data, error } =  await authClient.organization.create(value)

  if(data){
    return {
      ...data,
      message: 'Organization Created Successfully'
    }
  }

  throw new Error(error?.message || "Something went wrong. Please try again.");
}

const getUserOrganizations = async () => {
  const { data } = await authClient.organization.list({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
  })

  return data
}

const setActiveOrganization = async (organizationId: string) => {
  const { data } = await authClient.organization.setActive({
    fetchOptions: {
      headers: getHeaders() as HeadersInit,
    },
    organizationId,
  })

  return data?.id
}
