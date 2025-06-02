import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { z } from "zod"

import { authClient } from "@/lib/auth/client"
import { capitalize } from "@/lib/utils"
import {
  emailRequiredValidation,
  passwordRequiredValidation,
} from "@/lib/validations"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState<string | null | undefined>(null)
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: emailRequiredValidation("Email"),
        password: passwordRequiredValidation("Password"),
      }),
    },
    onSubmit: async ({ value }) => {
      setMessage(null)
      const { data, error } = await authClient.signIn.email(value)
      if (error) {
        setMessage(error?.message)
        return
      }
      if (data && !error) {
        router.navigate({ to: "/" })
      }
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
        name="email"
        children={(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>{capitalize(field.name)}</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              type="text"
              placeholder="example@email.com"
            />
            {!field.state.meta.isValid &&
              field.state.meta.errors.map((error) => (
                <p className="text-sm font-medium text-destructive">
                  {error?.message}
                </p>
              ))}
          </div>
        )}
      />
      <form.Field
        name="password"
        children={(field) => (
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor={field.name}>{capitalize(field.name)}</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={!field.state.meta.isValid}
              type="password"
              placeholder="••••••••"
            />
            {!field.state.meta.isValid &&
              field.state.meta.errors.map((error) => (
                <p className="text-sm font-medium text-destructive">
                  {error?.message}
                </p>
              ))}
          </div>
        )}
      />
      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>
        )}
      />
      {message && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      )}
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </form>
  )
}
