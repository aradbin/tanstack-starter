import { FormFieldType } from "@/lib/types";
import { validate } from "@/lib/validations"
import { useForm } from "@tanstack/react-form"
import RenderField from "@/components/form/render-field";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function FormComponent({ fields, handleSubmit, onSuccess, onError, onCancel, config }: {
  fields: FormFieldType[][]
  handleSubmit: any;
  onSuccess?: any;
  onError?: any;
  onCancel?: any;
  config?: {
    submitText?: string
    cancelText?: string
    loadingText?: string
  }
}) {
  const [messageSuccess, setMessageSuccess] = useState<string | null | undefined>(null)
  const [messageError, setMessageError] = useState<string | null | undefined>(null)
  const flatFields = fields.flat()

  const defaultValues = flatFields.reduce((values, field) => {
    values[field.name] = field.defaultValue || ""
    return values
  }, {} as Record<string, any>)

  const schemaOnBlur = flatFields.reduce((shape, field) => {
    if (field.validationOnBlur) {
      shape[field.name] = field.validationOnBlur
    }
    return shape
  }, {} as Record<string, any>)

  const schemaOnChange = flatFields.reduce((shape, field) => {
    if (field.validationOnChange) {
      shape[field.name] = field.validationOnChange
    }
    return shape
  }, {} as Record<string, any>)

  const schemaOnSubmit = flatFields.reduce((shape, field) => {
    if (field.validationOnSubmit) {
      shape[field.name] = field.validationOnSubmit
    }
    return shape
  }, {} as Record<string, any>)

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      ...Object.keys(schemaOnSubmit)?.length ? {
        onSubmit: validate(schemaOnSubmit)
      } : {},
      ...Object.keys(schemaOnBlur)?.length ? {
        onBlur: validate(schemaOnBlur)
      } : {},
      ...Object.keys(schemaOnChange)?.length ? {
        onChange: validate(schemaOnChange)
      } : {},
    },
    onSubmit: async ({ value }) => {
      setMessageSuccess(null)
      setMessageError(null)
      const { data, error } = await handleSubmit(value)
      if (error) {
        if (onError) {
          onError(error)
        }
        setMessageError(error.message || "Something went wrong. Please try again.")
      }
      if (data) {
        if(onSuccess) {
          onSuccess(data)
        }
        if(data.message) {
          setMessageSuccess(data.message)
        }
        form.reset()
      }
    },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {fields?.map((fieldGroup, groupIndex) => (
        <div key={groupIndex}>
          {fieldGroup?.map((field: FormFieldType, index) => (
            <form.Field
              key={index}
              name={field.name}
              children={(fieldProps) => (
                <div className="grid gap-2">
                  <RenderField field={{
                    ...field,
                    isValid: fieldProps?.state?.meta?.isTouched ? fieldProps?.state?.meta?.isValid : true,
                    value: fieldProps?.state?.value,
                    handleBlur: fieldProps?.handleBlur,
                    handleChange: fieldProps?.handleChange
                  }} />
                  
                  {fieldProps?.state?.meta?.isTouched &&
                  !fieldProps?.state?.meta?.isValid &&
                  fieldProps?.state?.meta?.errors.map((error: any, index: number) => (
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
          ))}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
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
                config?.submitText || "Submit"
              )}
            </Button>
          )}
        />
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            {config?.cancelText || "Cancel"}
          </Button>
        )}
      </div>
      {messageSuccess && (
        <Alert variant="default" className="border-green-800 text-green-800">
          <CheckCircle2Icon className="size-4" />
          <AlertTitle>{messageSuccess}</AlertTitle>
        </Alert>
      )}
      {messageError && (
        <Alert variant="destructive" className="border-destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>{messageError}</AlertTitle>
        </Alert>
      )}
    </form>
  )
}
