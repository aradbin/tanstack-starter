import { useRouteContext } from "@tanstack/react-router"

export const useAuth = () => {
  return useRouteContext({ from: "/_private" })
}