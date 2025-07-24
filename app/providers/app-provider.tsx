import { getDatas, TableType } from "@/lib/db/functions";
import { contacts, users } from "@/lib/db/schema";
import { AnyType } from "@/lib/types";
import { getMembers } from "@/routes/_private/members/-utils";
import { useQuery } from "@tanstack/react-query";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type DeleteIdType = {
  id: AnyType
  title: string
  table: TableType
} | null

type AppStateType = {
  isTaskOpen: boolean
  setIsTaskOpen: Dispatch<SetStateAction<boolean>>
  isContactOpen: boolean
  setIsContactOpen: Dispatch<SetStateAction<boolean>>
  editId: AnyType
  setEditId: Dispatch<SetStateAction<AnyType>>
  deleteId: DeleteIdType
  setDeleteId: Dispatch<SetStateAction<DeleteIdType>>
  users: typeof users.$inferSelect[]
  contacts: typeof contacts.$inferSelect[]
}

const initialState: AppStateType = {
  isTaskOpen: false,
  setIsTaskOpen: () => {},
  isContactOpen: false,
  setIsContactOpen: () => {},
  editId: null,
  setEditId: () => {},
  deleteId: null,
  setDeleteId: () => {},
  users: [],
  contacts: [],
}

const AppContext = createContext<AppStateType>(initialState)

export function AppProvider({
  children
}: {
  children: ReactNode
}) {
  const [isTaskOpen, setIsTaskOpen] = useState<boolean>(false)
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false)
  const [editId, setEditId] = useState()
  const [deleteId, setDeleteId] = useState<DeleteIdType>(null)

  const { data: users } = useQuery({
    queryKey: ['members', 'users', 'all'],
    queryFn: async () => {
      const members = await getMembers({ data: {} })
      return members?.result?.map((member) => (member.user)) || []
    }
  })

  const { data: contacts } = useQuery({
    queryKey: ['contacts', 'all'],
    queryFn: async () => {
      const response = await getDatas({ data: {
        table: "contacts"
      }})

      return response?.result || []
    }
  })

  return (
    <AppContext.Provider value={{
      isTaskOpen,
      setIsTaskOpen,
      isContactOpen,
      setIsContactOpen,
      editId,
      setEditId,
      deleteId,
      setDeleteId,
      users: users || [],
      contacts: contacts || [],
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
