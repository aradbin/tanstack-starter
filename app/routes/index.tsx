import { createFileRoute } from "@tanstack/react-router"

import { authClient } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div>
      {/* <Button
        onClick={async () => {
          const { data, error } = await authClient.signUp.email({
            email: "email@example.com",
            password: "12345678",
            name: "User",
          })
        }}
      ></Button> */}
    </div>
  )
}
