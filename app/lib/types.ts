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

export interface FieldType {
  name: string
  state: {
    value: string
  }
  handleBlur: () => void
  handleChange: (value: string) => void
  type?: string
  label?: string
  placeholder?: string
}
