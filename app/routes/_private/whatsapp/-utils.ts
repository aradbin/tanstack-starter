import { authOrgMiddleware } from "@/lib/auth/middleware";
import { AnyType } from "@/lib/types";
import { createServerFn } from "@tanstack/react-start";

export const getAccounts = createServerFn()
  .middleware([authOrgMiddleware])
  .validator((data: {
    url: string,
    params?: AnyType
  }) => data)
  .handler(async ({ data }) => {
    const params = data?.params ? new URLSearchParams(data?.params).toString() : ""
    return await fetch(`${process.env.UNIPILE_BASE_URL}${data?.url}?${params}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-KEY': process.env.UNIPILE_API_KEY || ""
      }
    })
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.error(err))
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
  