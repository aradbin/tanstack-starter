import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_private/")({
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
