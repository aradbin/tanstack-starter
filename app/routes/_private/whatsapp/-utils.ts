import { authOrgMiddleware } from "@/lib/auth/middleware";
import { AnyType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";

export const getUnipile = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: {
    url: string,
    params?: {
      account_type?: string,
      account_id?: string,
      limit?: string,
      cursor?: string,
      [key: string]: AnyType
    },
    attachment?: boolean,
  }) => {
    return {
      url: data?.url,
      params: {
        ...data?.params,
        limit: data?.params?.limit ?? "100",
      },
      attachment: data?.attachment || false
    }
  })
  .handler(async ({ data }) => {
    const params = data?.params ? `?${new URLSearchParams(data?.params).toString()}` : ""
    const response = await fetch(`${process.env.UNIPILE_BASE_URL}${data?.url}${params}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.UNIPILE_API_KEY || ""
      }
    })

    if (!response.ok) {
      throw new Error(`Something went wrong. Please try again.`)
    }

    if (data?.attachment) {
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      
      return {
        data: Array.from(new Uint8Array(arrayBuffer)),
        type: blob.type,
        size: blob.size
      }
    }
    
    return await response.json()
  })
  
export const postUnipile = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    url: string,
    formData: FormData,
    params?: {
      [key: string]: AnyType
    }
  }) => data)
  .handler(async ({ data }) => {
    const params = data?.params ? new URLSearchParams(data?.params).toString() : ""

    try {
      const response = await fetch(`${process.env.UNIPILE_BASE_URL}${data?.url}?${params}`, {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.UNIPILE_API_KEY || ""
        },
        body: data?.formData,
      })

      if (!response.ok) {
        throw new Error(`Something went wrong. Please try again.`);
      }

      return await response.json();
    } catch (error) {
      throw new Error("Something went wrong. Please try again.");
    }
  })
