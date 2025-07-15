import { TableType } from "@/lib/db/functions";
import { AnyType } from "@/lib/types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type DeleteIdType = {
  id: AnyType
  title: string
  table: TableType
} | null

type AppStateType = {
  isTaskOpen: boolean
  setIsTaskOpen: Dispatch<SetStateAction<boolean>>
  editId: AnyType
  setEditId: Dispatch<SetStateAction<AnyType>>
  deleteId: DeleteIdType
  setDeleteId: Dispatch<SetStateAction<DeleteIdType>>
}

const initialState: AppStateType = {
  isTaskOpen: false,
  setIsTaskOpen: () => {},
  editId: null,
  setEditId: () => {},
  deleteId: null,
  setDeleteId: () => {}
}

const AppContext = createContext<AppStateType>(initialState)

export function AppProvider({
  children
}: {
  children: ReactNode
}) {
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false)
  const [editId, setEditId] = useState()
  const [deleteId, setDeleteId] = useState<DeleteIdType>(null)

  return (
    <AppContext.Provider value={{
      isTaskOpen,
      setIsTaskOpen,
      editId,
      setEditId,
      deleteId,
      setDeleteId
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined){
    throw new Error("useApp must be used within a AppProvider")
  }

  return context
}
