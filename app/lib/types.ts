import { LucideIcon } from "lucide-react"

export interface NavItem {
  title?: string
  href?: string
  label?: string
  icon?: LucideIcon | null
  items?: NavItem[]
}

export interface NavigationType {
  title?: string
  items?: NavItem[]
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  [key: string]: unknown // This allows for additional properties...
}
