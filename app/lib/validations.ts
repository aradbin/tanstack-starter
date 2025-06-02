import { z } from "zod"

const maxLength = 35

export const stringValidation = (key: string, max: number = maxLength) => {
  return z.string().min(1, `${key} is required`).max(max, `${key} is too long`)
}

export const emailValidation = (key: string, max: number = maxLength) => {
  return z
    .string()
    .min(1, { message: `${key} is required` })
    .max(max, `${key} is too long`)
    .email({ message: `Invalid email address` })
}
