import { getDatas, TableType } from "@/lib/db/functions";
import { contacts, users } from "@/lib/db/schema";
import { getMembers } from "@/routes/_private/members/-utils";
import { useQuery } from "@tanstack/react-query";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type ModalStateType = {
  id: string | null
  isOpen: boolean
} | null
type DeleteModalStateType = {
  id: string | null
  title: string
  table: TableType
} | null

type AppStateType = {
  taskModal: ModalStateType
  setTaskModal: Dispatch<SetStateAction<ModalStateType>>
  contactModal: ModalStateType
  setContactModal: Dispatch<SetStateAction<ModalStateType>>
  customerModal: ModalStateType
  setCustomerModal: Dispatch<SetStateAction<ModalStateType>>
  deleteModal: DeleteModalStateType
  setDeleteModal: Dispatch<SetStateAction<DeleteModalStateType>>
  users: typeof users.$inferSelect[]
  contacts: typeof contacts.$inferSelect[]
}

const initialState: AppStateType = {
  taskModal: null,
  setTaskModal: () => {},
  contactModal: null,
  setContactModal: () => {},
  customerModal: null,
  setCustomerModal: () => {},
  deleteModal: null,
  setDeleteModal: () => {},
  users: [],
  contacts: [],
}

const AppContext = createContext<AppStateType>(initialState)

export function AppProvider({
  children
}: {
  children: ReactNode
}) {
  const [taskModal, setTaskModal] = useState<ModalStateType>(null)
  const [contactModal, setContactModal] = useState<ModalStateType>(null)
  const [customerModal, setCustomerModal] = useState<ModalStateType>(null)
  const [deleteModal, setDeleteModal] = useState<DeleteModalStateType>(null)

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
      taskModal,
      setTaskModal,
      contactModal,
      setContactModal,
      customerModal,
      setCustomerModal,
      deleteModal,
      setDeleteModal,
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
