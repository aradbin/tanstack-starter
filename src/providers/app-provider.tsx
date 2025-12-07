import { getDatas, TableType } from "@/lib/db/functions";
import { assets, employees, partners, users } from "@/lib/db/schema";
import { AnyType, ModalStateType } from "@/lib/types";
import { getMembers } from "@/routes/_private/members/-utils";
import { useQuery } from "@tanstack/react-query";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

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
  contacts: typeof partners.$inferSelect[]
  // transport
  vehicles: {
    id: string
    name: string
    image: string
  }[],
  drivers: typeof employees.$inferSelect[],
  helpers: typeof employees.$inferSelect[],
  employeeModal: ModalStateType
  setEmployeeModal: Dispatch<SetStateAction<ModalStateType>>
  assetModal: ModalStateType
  setAssetModal: Dispatch<SetStateAction<ModalStateType>>
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
  // transport
  vehicles: [],
  drivers: [],
  helpers: [],
  employeeModal: null,
  setEmployeeModal: () => {},
  assetModal: null,
  setAssetModal: () => {},
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
  // transport
  const [employeeModal, setEmployeeModal] = useState<ModalStateType>(null)
  const [assetModal, setAssetModal] = useState<ModalStateType>(null)

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
        table: "partners",
        where: {
          role: "customer"
        }
      }})

      return response?.result || []
    }
  })
  // transport
  const { data: vehicles } = useQuery({
    queryKey: ['assets', 'all'],
    queryFn: async () => {
      const response = await getDatas({ data: {
        table: "assets",
      }})

      if(response?.result){
        return response?.result?.map((vehicle: typeof assets.$inferSelect & {
          metadata: AnyType
        }) => ({
          id: vehicle?.id,
          name: vehicle?.metadata?.registrationNumber,
          image: vehicle?.image,
        }))
      }

      return []
    }
  })
  // transport
  const { data: { drivers, helpers } = { drivers: [], helpers: [] } } = useQuery({
    queryKey: ["employees", "drivers", "helpers"],
    queryFn: async () => {
      const response = await getDatas({
        data: {
          table: "employees",
          relation: {
            designation: true
          },
        },
      });

      const employees = response?.result ?? [];

      const mapEmployee = (employee: typeof employees.$inferSelect) => ({
        id: employee.id,
        name: employee.name,
        image: employee.image,
        email: employee.phone,
        designation: employee.designation?.name,
      });

      return {
        drivers: employees
          .filter((employee: typeof employees.$inferSelect) => employee.designation?.name?.toLowerCase() === "driver")
          .map(mapEmployee),
        helpers: employees
          .filter((employee: typeof employees.$inferSelect) => employee.designation?.name?.toLowerCase() === "helper")
          .map(mapEmployee),
      };
    },
  });

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
      // transport
      vehicles,
      drivers,
      helpers,
      employeeModal,
      setEmployeeModal,
      assetModal,
      setAssetModal,
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
