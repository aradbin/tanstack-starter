import { useQuery } from "@tanstack/react-query";

export function useGetQuery(key: string, queryFn: () => Promise<any>, payload: {
  params?: unknown
  initialData?: unknown
} = {
  params: {},
  initialData: null
}) {
  return useQuery({
    queryKey: [key, payload?.params],
    queryFn,
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: true,
    ...payload?.initialData ? { initialData: payload?.initialData } : {},
  })
}
