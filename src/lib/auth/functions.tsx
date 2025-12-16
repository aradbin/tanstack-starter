import { createServerFn } from "@tanstack/react-start"
import { getHeaders } from "@tanstack/react-start/server"

import { authClient } from "./client"
import { authMiddleware } from "./middleware"
import { db } from "@/lib/db"
import { sessions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { AnyType } from "../types"
import { auth } from "./config"

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

      let activeOrganization: AnyType = null;
      if (!context?.session?.activeOrganizationId) {
        if(organizations?.length){
          activeOrganization = await setActiveOrganization(organizations[0].id)
        
          if (context?.session) {
            await db.update(sessions).set({ activeOrganizationId: activeOrganization?.id }).where(eq(sessions.id, context.session.id))
            context.session.activeOrganizationId = activeOrganization?.id
          }
        }
      }else{
        activeOrganization = organizations?.find(org => org.id === context?.session?.activeOrganizationId) || null
      }

      return {
        ...context?.user,
        activeOrganizationId: context?.session?.activeOrganizationId,
        activeOrganization: context?.session?.activeOrganizationId ? {
          ...activeOrganization,
          metadata: JSON.parse(activeOrganization?.metadata || "{}")
        } : null,
        organizations,
      }
    }

    throw new Error("Session Timeout. Please login again")
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
  const headers: AnyType = getHeaders()

  const response = await auth.api.listOrganizations({
    headers: headers
  })

  return response
}

const setActiveOrganization = async (organizationId: string) => {
  const headers: AnyType = getHeaders()

  const response = await auth.api.setActiveOrganization({
    headers: headers,
    body: {
      organizationId
    }
  })

  return response
}
