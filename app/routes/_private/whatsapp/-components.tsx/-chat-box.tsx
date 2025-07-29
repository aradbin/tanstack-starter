import AvatarComponent from "@/components/common/avatar-component";
import ModalComponent from "@/components/modal/modal-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ChatList from "./-chat-list";
import { CheckCheck, EllipsisVertical, Menu, MessageCircle, MessageCircleDashed, Plus, Send, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { AnyType } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../-utils";
import LoadingComponent from "@/components/common/loading-component";
import { formatDateTime } from "@/lib/utils";

export default function ChatBox({
  selected,
  setSelected,
}: {
  selected: AnyType
  setSelected: (value: AnyType) => void
}) {
  const [message, setMessage] = useState<string>('')
  const scrollAreaRef = useRef<AnyType>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['whatsapp', 'messages', selected?.id],
    queryFn: async () => {
      return await getAccounts({
        data: {
          url: `/chats/${selected?.id}/messages`,
        }
      })
    },
    enabled: !!selected
  })

  console.log('messages',messages)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') ||  scrollAreaRef.current.querySelector('.overflow-auto') || scrollAreaRef.current
      
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [selected, messages])

  if(!selected) {
    return (
      <Card className="size-full">
        <CardContent className="size-full flex flex-col justify-center items-center gap-2 p-0">
          <MessageCircle className="size-24 text-primary/50" />
          <p className="text-muted-foreground">
            Select a chat to start a conversation.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='relative py-3 gap-3'>
      <CardHeader className='px-3 gap-0 border-b [.border-b]:pb-3'>
        <div className='flex justify-between items-center gap-2'>
          <AvatarComponent user={{
            name: selected?.name,
            id: selected?.id,
            email: selected?.provider_id?.split('@')[0],
          }} />
          <ModalComponent trigger={(
            <Button variant="ghost" size="icon" className='flex md:hidden'><Menu /></Button>
          )} variant='sheet' options={{
            header: "Whatsapp Messages",
          }}>
            <ChatList selected={selected} setSelected={setSelected} />
          </ModalComponent>
          <Button variant="outline" size="icon" onClick={() => setSelected(null)}><X /></Button>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-14.8rem)] md:h-[calc(100vh-16.8rem)]">
          <ul className="flex flex-col-reverse gap-y-2">
            {messages?.items?.map((message: AnyType, index: number) => {
              const isUser = message?.is_sender === 1
              return (
                <li key={index} className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  {!isUser && <AvatarComponent user={{
                    name: selected?.name,
                    id: selected?.id,
                    email: selected?.provider_id?.split('@')[0],
                  }} options={{ hideBody: true }} />}
                  <div className={`flex flex-col gap-1 w-2/3`}>
                    <div className={`bg-accent p-2 space-y-1 rounded-lg break-all ${isUser ? "bg-primary text-primary-foreground rounded-se-none" : "text-accent-foreground rounded-ss-none"}`}>
                      <div className="text-sm">{message?.text}</div>
                      <div className={`flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        <span className={`text-xs font-normal text-muted-foreground`}>
                          {formatDateTime(message?.timestamp)}
                        </span>
                        {isUser ? (
                          <CheckCheck className='size-3' />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="More actions">
                        <EllipsisVertical className="size-4 text-muted-foreground mt-[50%]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isUser ? "start" : "end"}>
                      <DropdownMenuItem>Create Task</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      </CardContent>
      <CardFooter className='px-3 gap-2 border-t [.border-t]:pt-3'>
        <Button variant="outline" size="icon" className='rounded-full'><Plus /></Button>
        <Input
          type="text"
          placeholder="Type a message..."
          autoComplete="off"
          className="bg-accent"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13 && e.shiftKey === false) {
              e.preventDefault()
              console.log(message)
            }
          }}
        />
        <Button variant="outline" size="icon"><Send /></Button>
      </CardFooter>
      <LoadingComponent isLoading={isLoading} />
    </Card>
  )
}
