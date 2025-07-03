import { LucideIcon } from "lucide-react"

export type AnyType = any

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

export interface FormFieldType {
  name: string
  type?: string
  label?: string
  placeholder?: string
  defaultValue?: any
  value?: any
  validationOnBlur?: any
  validationOnChange?: any
  validationOnSubmit?: any
  handleBlur?: any
  handleChange?: any
  isValid?: boolean
}

export interface OptionType {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface TableFilterType {
  key: string
  title?: string
  options?: OptionType[],
}
