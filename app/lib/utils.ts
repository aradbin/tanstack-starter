import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (text: string | undefined) => {
  if (!text || text.length === 0) return ""

  return text.charAt(0).toUpperCase() + text.slice(1)
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
