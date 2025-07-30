import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isValid } from "date-fns"
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

export const formatDateTime = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "do MMM, yyyy hh:mm a")
}

export function formatDateDistance(date: AnyType) {
  if (!date || !isValid(new Date(date))) return ""
  const distance = formatDistanceToNow(new Date(date), { addSuffix: true })

  const replacements: Record<string, string> = {
    minute: "min",
    minutes: "mins",
    hour: "hr",
    hours: "hrs",
    day: "day",
    days: "days",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
  }

  if (distance === "less than a minute ago") {
    return "just now"
  }

  return distance
    .replace(
      /less than a minute|minute|minutes|hour|hours|day|days|month|months|year|years/g,
      (match) => replacements[match]
    )
    .replace(/\b(over|almost|about)\b/g, "")
}

export const formatDate = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "do MMM, yyyy")
}

export const formatDateForInput = (date: AnyType) => {
  if (!date || !isValid(new Date(date))) return ""
  return format(new Date(date), "yyyy-MM-dd")
}

export const isUrl = (string: string) => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  if(!!urlPattern.test(string)){
    return true
  }

  return false
}
