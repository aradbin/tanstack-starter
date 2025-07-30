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
  
export const sendMessage = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: {
    url: string,
    params?: AnyType
  }) => data)
  .handler(async ({ data }) => {
    const params = data?.params ? new URLSearchParams(data?.params).toString() : ""
    return await fetch(`${process.env.UNIPILE_BASE_URL}${data?.url}?${params}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-KEY': process.env.UNIPILE_API_KEY || ""
      }
    })
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.error(err))
  })
  