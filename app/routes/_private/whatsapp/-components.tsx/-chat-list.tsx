import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getUnipile } from "../-utils"
import { Button } from "@/components/ui/button"
import AvatarComponent from "@/components/common/avatar-component"
import { AnyType } from "@/lib/types"
import LoadingComponent from "@/components/common/loading-component"
import { Fragment } from "react"
import { Loader2 } from "lucide-react"

export default function ChatList({
  selected,
  setSelected
}: {
  selected: AnyType
  setSelected: (value: AnyType) => void
}) {
  const { data: chats, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['whatsapp', 'chats'],
    queryFn: ({ pageParam }) => getUnipile({
      data: {
        url: '/chats',
        params: {
          account_type: "WHATSAPP",
          account_id: "oABSPAUgTnG7fkd1nW12aA",
          ...pageParam
        }
      }
    }),
    initialPageParam: {},
    getNextPageParam: (lastPage, _) => (lastPage.cursor ? { cursor: lastPage.cursor } : null),
  })

  console.log('chats',chats)

  return (
    <>
      <ul className="space-y-1.5">
        {chats?.pages?.map((page: AnyType, indexPage: number) => (
          <Fragment key={indexPage}>
            {page?.items?.map((chat: AnyType, indexChat: number) => (
              <li key={indexChat}>
                <Button variant="ghost" className={`w-full h-fit justify-between gap-2 ${selected?.id === chat?.id ? 'bg-accent' : ''}`} onClick={() => setSelected(chat)}>
                  <AvatarComponent user={{
                    name: chat?.name,
                    id: chat?.id,
                    email: chat?.provider_id?.split('@')[0],
                  }} />
                </Button>
              </li>
            ))}
          </Fragment>
        ))}
        {hasNextPage && (
          <li>
            <Button variant="outline" className="w-full h-fit" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>{isFetchingNextPage ? <Loader2 className="animate-spin" /> : "Load More"}</Button>
          </li>
        )}
      </ul>
      {isLoading && <LoadingComponent isLoading={isLoading} />}
    </>
  )
}