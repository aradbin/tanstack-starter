import SelectField from '@/components/form/select-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, SquarePen } from 'lucide-react'
import { useState } from 'react'
import ChatList from './-components.tsx/-chat-list'
import ChatBox from './-components.tsx/-chat-box'

export const Route = createFileRoute('/_private/whatsapp/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className='flex gap-4 size-full'>
      <Card className='hidden md:flex py-3 gap-3 w-72'>
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
          <Button variant="outline" size="icon">
            <SquarePen />
          </Button>
        </CardHeader>
        <CardContent className='px-3'>
          <ScrollArea className="h-[calc(100vh-13rem)]">
            <ChatList selected={selected} setSelected={setSelected} />
          </ScrollArea>
        </CardContent>
      </Card>
      <div className='grow'>
        <ChatBox selected={selected} setSelected={setSelected} />
      </div>
    </div>
  )
}
