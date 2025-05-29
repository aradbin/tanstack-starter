import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(fullName: string) {
  if (fullName.length === 0) return ""

  const names = fullName.split(" ")
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("")

  return initials
}
