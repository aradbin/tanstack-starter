import { useQuery } from "@tanstack/react-query"
import { getAccounts } from "../-utils"
import { Button } from "@/components/ui/button"
import AvatarComponent from "@/components/common/avatar-component"
import { AnyType } from "@/lib/types"
import LoadingComponent from "@/components/common/loading-component"

export default function ChatList({
  selected,
  setSelected
}: {
  selected: AnyType
  setSelected: (value: AnyType) => void
}) {
  const { data: chats, isLoading } = useQuery({
    queryKey: ['whatsapp', 'chats'],
    queryFn: async () => {
      return await getAccounts({
        data: {
          url: '/chats',
          params: {
            account_type: "WHATSAPP",
            account_id: "oABSPAUgTnG7fkd1nW12aA"
          }
        }
      })
    },
  })

  console.log('chats',chats)

  return (
    <ul className="space-y-1.5">
      {chats?.items?.map((chat: AnyType, index: number) => (
        <li key={index}>
          <Button variant="ghost" className={`w-full h-fit justify-between gap-2 ${selected?.id === chat?.id ? 'bg-accent' : ''}`} onClick={() => setSelected(chat)}>
            <AvatarComponent user={{
              name: chat?.name,
              id: chat?.id,
              email: chat?.provider_id?.split('@')[0],
            }} />
          </Button>
        </li>
      ))}
      <LoadingComponent isLoading={isLoading} />
    </ul>
  )
}