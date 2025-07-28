import AvatarComponent from '@/components/common/avatar-component'
import ModalComponent from '@/components/modal/modal-component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Menu, MessageCircle, Send, SquarePen } from 'lucide-react'

export const Route = createFileRoute('/_private/whatsapp/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex gap-4 h-full w-full'>
      <aside className='hidden md:flex'>
        <Card className='py-3 gap-3'>
          <CardHeader className='flex px-3 border-b [.border-b]:pb-3'>
            <Input placeholder="Search" />
            <Button variant="ghost" size="icon" aria-label="New chat or group">
              <SquarePen />
            </Button>
          </CardHeader>
          <CardContent className='px-3'>
            <ScrollArea className="h-[calc(100vh-14.5rem)]">
              <ul className="space-y-1.5">
                {Array.from({ length: 10 }).map((_, index) => <li key={index}>
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
            <div className='flex items-center gap-2'>
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
                    {Array.from({ length: 10 }).map((_, index) => (
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
              <AvatarComponent user={{
                name: 'John Doe',
                id: '1',
                email: 'Hi there! I am John Doe.',
              }} />
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <ScrollArea className="h-[calc(100vh-16.8rem)]">
              <ul className="flex flex-col-reverse gap-y-1.5 px-6 py-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <li className={`flex gap-2 ${index%2 ? "flex-row-reverse" : ""}`}>
                    <AvatarComponent user={{
                      name: 'John Doe',
                      id: '1',
                      email: 'Hi there! I am John Doe.',
                    }} options={{ hideBody: true }} />
                    <div className="flex flex-col gap-1 w-full max-w-[320px]">
                      <div className={`text-sm text-accent-foreground bg-accent p-2 space-y-2 rounded-lg break-all ${index%2 ? "bg-primary text-primary-foreground rounded-se-none" : "rounded-ss-none"}`}>
                        Hi there! I am John Doe.
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-normal text-muted-foreground">
                          9 minutes ago
                        </span>
                        {index%2 ? (
                          <Check />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
          <CardFooter className='px-3 gap-2 border-t [.border-t]:pt-3'>
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
