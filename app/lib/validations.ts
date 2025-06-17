import { z, ZodObject, ZodRawShape } from "zod/v4"

const maxLength = 35

export const validateForm = <T extends ZodRawShape>(
  schema: T
): ZodObject<T> => {
  return z.object(schema)
}

export const stringRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z
    .string()
    .min(1, { error: `${key} is required` })
    .max(max, { error: `${key} is too long` })
}

export const emailRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z
    .email({ error: `Provide valid email address` })
    .max(max, { error: `${key} is too long` })
}

export const passwordRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z
    .string()
    .min(8, { error: `${key} must be at least 8 characters` })
    .max(max, { error: `${key} is too long` })
}
