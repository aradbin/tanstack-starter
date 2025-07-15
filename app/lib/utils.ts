import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"
import { AnyType, OptionType } from "./types"
import { users } from "./db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (text: string | undefined) => {
  if (!text || text.trim().length === 0) return ""

  return text
    .split(" ")
    .map(word =>
      word.length > 0
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : ""
    )
    .join(" ")
}

export const getInitials = (fullName: string | undefined | null): string => {
  if (!fullName || fullName.length === 0) return ""

  const names = fullName.trim().split(" ")

  if (names.length === 0) return ""
  if (names.length === 1) return names[0].charAt(0).toUpperCase()

  const firstInitial = names[0].charAt(0)
  const lastInitial = names[names.length - 1].charAt(0)

  return `${firstInitial}${lastInitial}`.toUpperCase()
}

export const getUserOptions = (items: typeof users.$inferSelect[]): OptionType[] => {
  return items?.map((item) => ({
    label: item.name,
    value: item.id,
    description: item.email,
    image: item.image || '',
  })) || []
}

export const formatDateTime = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "do MMM, yyyy hh:mm a")
}

export const formatDate = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "do MMM, yyyy")
}

export const formatDateForInput = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "yyyy-MM-dd")
}
