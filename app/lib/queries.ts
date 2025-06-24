import { useQuery } from "@tanstack/react-query";

export function useGetQuery(key: string, queryFn: Function, payload: {
  params?: unknown
  initialData?: unknown
}) {
  return useQuery({
    queryKey: [key, JSON.stringify(payload?.params)],
    queryFn: () => queryFn(payload?.params),
    initialData: payload?.initialData
  })
}
