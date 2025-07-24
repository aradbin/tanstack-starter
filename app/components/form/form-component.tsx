import { AnyType, FormFieldType } from "@/lib/types";
import { validate } from "@/lib/validations"
import { useForm } from "@tanstack/react-form"
import RenderField from "@/components/form/render-field";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { capitalize } from "@/lib/utils";
import LoadingComponent from "../common/loading-component";

export default function FormComponent({ fields, handleSubmit, children, values ={}, onSuccess, onError, onCancel, options }: {
  fields: FormFieldType[][]
  handleSubmit: any
  children?: ReactNode
  values?: Record<string, any>
  onSuccess?: any
  onError?: any
  onCancel?: any
  options?: {
    isLoading?: boolean
    queryKey?: string | string[]
    submitText?: string
    cancelText?: string
    loadingText?: string
    btnWidth?: string
    submitVariant?: "default" | "destructive"
  }
}) {
  const queryClient = useQueryClient()
  const [messageError, setMessageError] = useState<string | null | undefined>(null)
  const flatFields = fields.flat()

  const defaultValues = flatFields.reduce((flatDefaultValues, field) => {
    flatDefaultValues[field.name] = field.defaultValue || ""
    return flatDefaultValues
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
      setMessageError(null)
      try {
        const response = await handleSubmit(value)
        console.log('form response', response)
        if(options?.queryKey) {
          queryClient.invalidateQueries({
            queryKey: typeof options.queryKey === 'string' ? [options.queryKey] : options.queryKey
          })
        }
        form.reset()
        if(response?.message) {
          options?.submitVariant === "destructive" ? toast.error(response?.message) : toast.success(response?.message)
        }
        if(onSuccess) {
          onSuccess(response)
        }
      } catch (error: AnyType) {
        if (onError) {
          onError(error)
        }
        setMessageError(error.message || "Something went wrong. Please try again.")
      }
    },
  })

  useEffect(() => {
    if(Object.keys(values)?.length){
      Object.keys(values)?.forEach((item) => {
        const field = flatFields.find((field) => field.name === item)
        if(field){
          form.setFieldValue(item, values[item])
        }
      });
    }
  },[values])

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {fields?.map((fieldGroup, groupIndex) => (
        <div className={`grid grid-cols-1 md:grid-cols-${fieldGroup?.length} gap-2`} key={groupIndex}>
          {fieldGroup?.map((field: FormFieldType, index) => (
            <form.Field
              key={index}
              name={field.name}
              children={(fieldProps) => {
                const isValid = fieldProps?.state?.meta?.isTouched ? fieldProps?.state?.meta?.isValid : true
                if(field.type !== 'hidden'){
                  return (
                    <div className="grid gap-2">
                      <Label
                        htmlFor={field?.name}
                        className={!isValid ? "text-destructive" : ""}
                      >
                        {field?.label || capitalize(field?.name)}
                      </Label>
                      <RenderField field={{
                        ...field,
                        isValid,
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
                  )
                }

                return null
              }}
            />
          ))}
        </div>
      ))}
      {children}
      <div className="flex flex-row-reverse flex-wrap gap-2">
        <form.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              variant={options?.submitVariant || "default"}
              type="submit"
              className={`${options?.btnWidth || "w-30"}`}
              disabled={isSubmitting || options?.isLoading}
              aria-busy={isSubmitting || options?.isLoading}
              aria-disabled={isSubmitting || options?.isLoading}
            >
              {(isSubmitting || options?.isLoading) ? (
                <>
                  <Loader2 className="animate-spin" /> Please wait
                </>
              ) : (
                options?.submitText || "Submit"
              )}
            </Button>
          )}
        />
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className={`${options?.btnWidth || "w-30"}`}
            onClick={() => {
              form.reset()
              onCancel()
            }}
          >
            {options?.cancelText || "Cancel"}
          </Button>
        )}
      </div>
      {messageError && (
        <Alert variant="destructive" className="border-destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{messageError}</AlertTitle>
        </Alert>
      )}
      <LoadingComponent isLoading={options?.isLoading} />
    </form>
  )
}
