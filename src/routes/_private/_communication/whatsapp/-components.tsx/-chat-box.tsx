import AvatarComponent from "@/components/common/avatar-component";
import ModalComponent from "@/components/modal/modal-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ChatList from "./-chat-list";
import { CheckCheck, EllipsisVertical, Loader2, Menu, MessageCircle, Paperclip, Plus, Send, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment, useEffect, useRef, useState } from "react";
import { AnyType } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getUnipile, postUnipile } from "../-utils";
import LoadingComponent from "@/components/common/loading-component";
import { formatDateDistance, formatDateTime, isUrl } from "@/lib/utils";
import ChatAttachment from "./-chat-attachment";
import { toast } from "sonner";

export default function ChatBox({
  selected,
  setSelected,
}: {
  selected: AnyType
  setSelected: (value: AnyType) => void
}) {
  const scrollAreaRef = useRef<AnyType>(null)
  const [isLoadingSend, setIsLoadingSend] = useState<boolean>(false)
  const [files, setFiles] = useState<AnyType>(null)

  const { data: messages, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['whatsapp', 'messages', selected?.id],
    queryFn: ({ pageParam }) => getUnipile({
      data: {
        url: `/chats/${selected?.id}/messages`,
        params: {
          ...pageParam
        }
      }
    }),
    getNextPageParam: (lastPage, _) => (lastPage.cursor ? { cursor: lastPage.cursor } : null),
    initialPageParam: {},
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

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if(!files && form.text.value === ''){
      return
    }
    setIsLoadingSend(true)
    const formData = new FormData()
    if(form.text.value){
      formData.append('text', form.text.value)
    }
    if(files && Object.keys(files).length > 0){
      Object.keys(files)?.forEach((key: any) => {
        formData.append('attachments', files[key])
      })
    }

    try {
      await postUnipile({
        data: {
          url: `/chats/${selected?.id}/messages`,
          formData,
        }
      })
      form.reset()
      refetch()
    } catch (error) {
      console.log('error',error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoadingSend(false)
    }
  }

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
    <Card className='py-3 gap-0'>
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
      <CardContent className="relative p-3">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-14.8rem)] md:h-[calc(100vh-16.8rem)]">
          <ul className="flex flex-col-reverse gap-y-2">
            {messages?.pages?.map((page: AnyType, indexPage: number) => (
              <Fragment key={`${selected?.id}-${indexPage}`}>
                {page?.items?.map((message: AnyType, indexMessage: number) => {
                  const isUser = message?.is_sender === 1
                  return (
                    <li key={`${selected?.id}-${indexPage}-${indexMessage}`} className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                      {!isUser && <AvatarComponent user={{
                        name: selected?.name,
                        id: selected?.id,
                        email: selected?.provider_id?.split('@')[0],
                      }} options={{ hideBody: true }} />}
                      <div className={`flex flex-col gap-1 w-auto max-w-2/3 p-2 space-y-1 rounded-lg break-all ${isUser ? "bg-accent text-accent-foreground" : "bg-accent text-accent-foreground"}`}>
                        <div className="text-sm">
                          {isUrl(message?.text) ?
                            <a href={message?.text?.startsWith('http') ? message?.text : 'https://' + message?.text} target='_blank' rel="noreferrer" className="underline hover:text-blue-300">
                              {message?.text}
                            </a>
                          :
                            message?.text
                          }
                        </div>
                        {message?.attachments && message?.attachments?.map((attachment: any, index: number) => (
                          <ChatAttachment key={`${selected?.id}-${indexPage}-${indexMessage}-${attachment.id}`} message={message?.id} attachment={attachment} />
                        ))}
                        <div className={`flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                          <span className={`text-xs font-normal text-muted-foreground`}>
                            {formatDateDistance(message?.timestamp)}
                          </span>
                          {message?.edited ? <span className='text-xs text-muted-foreground'>Edited</span> : <></>}
                          {isUser ? <CheckCheck className='size-3' /> : <></>}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="More actions">
                            <EllipsisVertical className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isUser ? "start" : "end"}>
                          <DropdownMenuItem>Create Task</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  )
                })}
              </Fragment>
            ))}
            {hasNextPage && (
              <li className="flex justify-center">
                <Button variant="outline" className="w-[200px]" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>{isFetchingNextPage ? <Loader2 className="animate-spin" /> : "Load More"}</Button>
              </li>
            )}
          </ul>
        </ScrollArea>
        <LoadingComponent isLoading={isLoading} />
      </CardContent>
      <form onSubmit={sendMessage} encType="multipart/form-data">
        <CardFooter className='px-3 gap-2 border-t [.border-t]:pt-3'>
          <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById('attachments')?.click()}><Paperclip /></Button>
          <Input type="file" id="attachments" name="attachments[]" multiple className="hidden" onChange={(e) => setFiles(e.target.files)} />
          <Input
            type="text"
            name="text"
            placeholder="Type a message..."
            autoComplete="off"
            className="bg-accent"
          />
          <Button type="submit" variant="outline" size="icon">{(isLoadingSend || isFetching) ?  <Loader2 className="animate-spin" /> : <Send />}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
