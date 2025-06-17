import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { z } from "zod"

import { signIn } from "@/lib/auth/functions"
import { capitalize } from "@/lib/utils"
import {
  emailRequiredValidation,
  passwordRequiredValidation,
} from "@/lib/validations"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AuthProviders from "../-auth-providers"

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
      const { data, error } = await signIn(value)

      if (error) {
        setMessage(error.message || "Something went wrong. Please try again.")
      }

      if (data) {
        router.navigate({ to: "/" })
      }
    },
  })

  return (
    <div className="grid gap-6">
      <AuthProviders />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
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
              {field.state.meta.isTouched &&
                !field.state.meta.isValid &&
                field.state.meta.errors.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm font-medium text-destructive"
                  >
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
              {field.state.meta.isTouched &&
                !field.state.meta.isValid &&
                field.state.meta.errors.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm font-medium text-destructive"
                  >
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
              className="w-full"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-disabled={isSubmitting}
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
          <Alert variant="destructive" className="border-destructive">
            <AlertCircleIcon className="size-4" />
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
    </div>
  )
}
