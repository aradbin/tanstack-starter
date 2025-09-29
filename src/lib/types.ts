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
  email?: string | undefined | null
  phone?: string | undefined | null
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
  handleAfterChange?: any
  isValid?: boolean
  isRequired?: boolean
  disabled?: boolean
  readonly?: boolean
}

export interface TableFilterType {
  key: string
  value?: AnyType
  label?: string
  multiple?: boolean
  options?: OptionType[],
  type?: string
  icon?: LucideIcon
}

export interface TableActionType {
  view?: (id: AnyType) => void
  edit?: (id: AnyType) => void
  delete?: (id: AnyType) => void
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

export type ModalStateType = {
  id: string | null
  isOpen: boolean
} | null

export type WhereType = Record<string, AnyType>