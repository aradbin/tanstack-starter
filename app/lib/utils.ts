import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

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

export const formatDateTime = (date: Date) => {
  if (!date || !isValid(date)) return ""
  return format(new Date(date), "do MMM, yyyy hh:mm a")
}

export const formatDate = (date: Date) => {
  if (!date || !isValid(date)) return ""
  return format(new Date(date), "do MMM, yyyy")
}
