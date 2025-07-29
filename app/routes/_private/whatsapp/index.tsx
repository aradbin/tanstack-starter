import AvatarComponent from '@/components/common/avatar-component'
import SelectField from '@/components/form/select-field'
import ModalComponent from '@/components/modal/modal-component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnyType } from '@/lib/types'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCheck, EllipsisVertical, Menu, Plus, Send, SquarePen } from 'lucide-react'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/_private/whatsapp/')({
  component: RouteComponent,
})

function RouteComponent() {
  const scrollAreaRef = useRef<AnyType>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') ||  scrollAreaRef.current.querySelector('.overflow-auto') || scrollAreaRef.current
      
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [])

  return (
    <div className='flex gap-4 h-full w-full'>
      <aside className='hidden md:flex'>
        <Card className='py-3 gap-3'>
          <CardHeader className='flex px-3 border-b [.border-b]:pb-3'>
            <div className='grow'>
              <SelectField field={{
                name: 'account',
                options: [],
                handleChange: () => {},
                isValid: true,
                isRequired: true
              }} />
            </div>
            <Button variant="outline" size="icon">
              <Plus />
            </Button>
          </CardHeader>
          <CardHeader className='flex px-3 border-b [.border-b]:pb-3'>
            <div className='grow'>
              <Input placeholder="Search" />
            </div>
            <Button variant="outline" size="icon">
              <SquarePen />
            </Button>
          </CardHeader>
          <CardContent className='px-3'>
            <ScrollArea className="h-[calc(100vh-16.8rem)]">
              <ul className="space-y-1.5">
                {Array.from({ length: 50 }).map((_, index) => <li key={index}>
                  <Button variant="ghost" className='w-full h-fit justify-between gap-2'>
                    <AvatarComponent user={{
                      name: 'John Doe',
                      id: '1',
                      email: 'Hi there! I am John Doe.',
                    }} />
                    <span className="text-xs text-muted-foreground font-semibold">9 minutes ago</span>
                  </Button>
                </li>)}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </aside>
      <main className='flex-1'>
        <Card className='py-3 gap-3'>
          <CardHeader className='px-3 gap-0 border-b [.border-b]:pb-3'>
            <div className='flex justify-between items-center gap-2'>
              <AvatarComponent user={{
                name: 'John Doe',
                id: '1',
                email: 'Hi there! I am John Doe.',
              }} />
              <ModalComponent trigger={(
                <Button variant="ghost" size="icon" className='flex md:hidden'><Menu /></Button>
              )} variant='sheet' options={{
                header: "Whatsapp Messages",
              }}>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-1.5 pb-3'>
                    <Input placeholder="Search" />
                    <Button variant="ghost" size="icon" aria-label="New chat or group">
                      <SquarePen />
                    </Button>
                  </div>
                  <ul className="space-y-1.5">
                    {Array.from({ length: 50 }).map((_, index) => (
                      <li key={index}>
                        <Button variant="ghost" className='w-full h-fit justify-between gap-2'>
                          <AvatarComponent user={{
                            name: 'John Doe',
                            id: '1',
                            email: 'Hi there! I am John Doe.',
                          }} />
                          <span className="text-xs text-muted-foreground font-semibold">9 minutes ago</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </ModalComponent>
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-14.8rem)] md:h-[calc(100vh-16.8rem)]">
              <ul className="flex flex-col-reverse gap-y-2">
                {Array.from({ length: 50 }).map((_, index) => (
                  <li className={`flex items-start gap-2 ${index%2 ? "flex-row-reverse" : ""}`}>
                    <AvatarComponent user={{
                      name: 'John Doe',
                      id: '1',
                      email: 'Hi there! I am John Doe.',
                    }} options={{ hideBody: true }} />
                    <div className={`flex flex-col gap-1 w-full`}>
                      <div className={`bg-accent p-2 space-y-1 rounded-lg break-all ${index%2 ? "bg-primary text-primary-foreground rounded-se-none" : "text-accent-foreground rounded-ss-none"}`}>
                        <div className="text-sm">Hi there! I am John Doe. {index}</div>
                        <div className={`flex items-center gap-1 ${index%2 ? "justify-end" : "justify-start"}`}>
                          <span className={`text-xs font-normal text-muted-foreground`}>
                            9 minutes ago
                          </span>
                          {index%2 ? (
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
                      <DropdownMenuContent align={index%2 ? "start" : "end"}>
                        <DropdownMenuItem>Create Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
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
            />
            <Button variant="outline" size="icon"><Send /></Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
