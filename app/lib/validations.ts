import { z } from "zod"

const maxLength = 35

export const stringRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z.string().min(1, `${key} is required`).max(max, `${key} is too long`)
}

export const emailRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z
    .string()
    .email({ message: `Provide valid email address` })
    .max(max, `${key} is too long`)
}

export const passwordRequiredValidation = (
  key: string,
  max: number = maxLength
) => {
  return z
    .string()
    .min(8, `${key} must be at least 8 characters`)
    .max(max, `${key} is too long`)
}
