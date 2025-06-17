import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"

import { signUp } from "@/lib/auth/functions"
import { capitalize } from "@/lib/utils"
import {
  emailRequiredValidation,
  passwordRequiredValidation,
  stringRequiredValidation,
  validateForm,
} from "@/lib/validations"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AuthProviders from "../-auth-providers"

export const Route = createFileRoute("/_auth/register/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState<string | null | undefined>(null)
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onBlur: validateForm({
        name: stringRequiredValidation("Name"),
        email: emailRequiredValidation("Email"),
        password: passwordRequiredValidation("Password"),
      }),
    },
    onSubmit: async ({ value }) => {
      setMessage(null)
      const { data, error } = await signUp(value)

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
          name="name"
          children={(field) => (
            <div className="grid gap-2">
              <Label
                htmlFor={field.name}
                className={!field.state.meta.isValid ? "text-destructive" : ""}
              >
                {capitalize(field.name)}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={!field.state.meta.isValid}
                type="text"
                placeholder="Your name"
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
              <Label htmlFor={field.name}>{capitalize(field.name)}</Label>
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
                "Register"
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
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </div>
  )
}
