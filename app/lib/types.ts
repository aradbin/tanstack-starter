import { LucideIcon } from "lucide-react"

export interface NavItemType {
  title?: string
  href?: string
  label?: string
  icon?: LucideIcon | null
  items?: NavItemType[]
}

export interface NavigationType {
  title?: string
  items?: NavItemType[]
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
