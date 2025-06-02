import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link } from "@tanstack/react-router"
import { z } from "zod"

import { emailValidation, stringValidation } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Route = createFileRoute("/_auth/register/")({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        name: stringValidation("Name"),
        email: emailValidation("Email"),
        password: stringValidation("Password"),
      }),
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form submitted:", value)
    },
  })

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="text"
              placeholder="Your name"
            />
          </div>
        )}
      />
      <form.Field
        name="email"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="email"
              placeholder="example@email.com"
            />
          </div>
        )}
      />
      <form.Field
        name="password"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              type="password"
            />
          </div>
        )}
      />
      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "..." : "Register"}
          </Button>
        )}
      />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}
