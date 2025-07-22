import { LucideIcon } from "lucide-react"
import { ComponentType } from "react"

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

export interface OptionType {
  id: string | number
  name: string
  email?: string
  icon?: ComponentType<{ className?: string }>
  image?: string | null
}

export interface FormFieldType {
  name: string
  type?: string
  label?: string
  placeholder?: string
  options?: OptionType[]
  defaultValue?: any
  value?: any
  validationOnBlur?: any
  validationOnChange?: any
  validationOnSubmit?: any
  handleBlur?: any
  handleChange?: any
  isValid?: boolean
}

export interface TableFilterType {
  key: string
  label?: string
  multiple?: boolean
  options?: OptionType[],
  type?: string
}

export interface SortType {
  field?: string
  order?: string
}

export interface PaginationType {
  page?: number
  pageSize?: number
  hasPagination?: boolean
}

export interface SearchType {
  term: AnyType
  key?: string[]
}

export type WhereType = Record<string, AnyType>