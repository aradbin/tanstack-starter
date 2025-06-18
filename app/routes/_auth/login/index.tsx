import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"

import { signIn } from "@/lib/auth/functions"
import { capitalize } from "@/lib/utils"
import {
  emailRequiredValidation,
  passwordRequiredValidation,
  validateForm,
} from "@/lib/validations"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import AuthProviders from "../-auth-providers"
import { FormFieldType } from "@/lib/types"
import FormComponent from "@/components/form/form-component"

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const fields: FormFieldType[][] = [
    [
      {
        name: "email",
        validationOnSubmit: emailRequiredValidation("Email"),
        placeholder: "example@email.com",
      },
    ],
    [
      {
        name: "password",
        type: "password",
        validationOnSubmit: passwordRequiredValidation("Password"),
        placeholder: "••••••••",
      },
    ],
    ]

  return (
    <div className="grid gap-6">
      <AuthProviders />
      <FormComponent
        fields={fields}
        handleSubmit={signIn}
        onSuccess={() => {
          router.navigate({ to: "/" })
        }}
        submitText="Login"
      />
      <div className="flex flex-col gap-2">
        <div className="text-center text-sm">
          <a
            href="#"
            className="underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
