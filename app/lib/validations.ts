import { z, ZodObject, ZodRawShape } from "zod/v4"

const maxLength = 35

export const validate = <T extends ZodRawShape>(
  schema: T
): ZodObject<T> => {
  return z.object(schema)
}

export const numberValidation = (
  key: string
) => {
  return z.number({ error: `${key} has to be number` }).optional()
}

export const stringValidation = (
  key: string,
  max: number = maxLength
) => {
  return z.string({ error: `${key} has to be string` }).max(max, { error: `${key} is too long` })
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
