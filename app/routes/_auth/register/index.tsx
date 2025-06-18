import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { signUp } from "@/lib/auth/functions"
import {
  emailRequiredValidation,
  passwordRequiredValidation,
  stringRequiredValidation,
} from "@/lib/validations"
import AuthProviders from "../-auth-providers"
import FormComponent from "@/components/form/form-component"
import { FormFieldType } from "@/lib/types"

export const Route = createFileRoute("/_auth/register/")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const fields: FormFieldType[][] = [
    [{
      name: "name",
      placeholder: "Enter your name",
      validationOnSubmit: stringRequiredValidation("Name"),
    }],
    [{
      name: "email",
      validationOnSubmit: emailRequiredValidation("Email"),
      placeholder: "example@email.com",
    }],
    [{
      name: "password",
      type: "password",
      validationOnSubmit: passwordRequiredValidation("Password"),
      placeholder: "••••••••",
    }],
  ]

  return (
    <div className="grid gap-6">
      <AuthProviders />
      <FormComponent fields={fields} handleSubmit={signUp} onSuccess={() => {
        router.navigate({ to: "/" })
      }} config={{
        submitText: "Register"
      }} />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  )
}
