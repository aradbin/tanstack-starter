import { createFileRoute, useRouter } from "@tanstack/react-router"
import { createOrganization, signOut } from "@/lib/auth/functions"
import { stringRequiredValidation } from "@/lib/validations"
import { FormFieldType } from "@/lib/types"
import FormComponent from "@/components/form/form-component"

export const Route = createFileRoute("/_auth/register/organization")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const fields: FormFieldType[][] = [
    [{
      name: "name",
      validationOnSubmit: stringRequiredValidation("Name"),
      placeholder: "Enter organization name",
    }],
    [{
      name: "slug",
      validationOnSubmit: stringRequiredValidation("Slug"),
      placeholder: "Enter organization slug",
    }]
  ]

  return (
    <div className="grid gap-6">
      <div className="text-center text-sm text-muted-foreground">
        You're not in any organization yet. Create one to continue.
      </div>
      <FormComponent
        fields={fields}
        handleSubmit={createOrganization}
        onSuccess={() => {
          router.navigate({ to: "/" })
        }}
        onCancel={() => {
          signOut()
          router.navigate({ to: "/" })
        }}
        options={{
          btnWidth: "w-full",
        }}
      />
    </div>
  )
}
