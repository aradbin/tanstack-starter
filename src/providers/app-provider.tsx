import { getDatas, TableType } from "@/lib/db/functions";
import { assets, contacts, employees, users } from "@/lib/db/schema";
import { ModalStateType } from "@/lib/types";
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
  contacts: typeof contacts.$inferSelect[]
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
  vehicleModal: ModalStateType
  setVehicleModal: Dispatch<SetStateAction<ModalStateType>>
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
  vehicleModal: null,
  setVehicleModal: () => {},
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
  const [vehicleModal, setVehicleModal] = useState<ModalStateType>(null)

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
  // transport
  const { data: vehicles } = useQuery({
    queryKey: ['assets', 'all'],
    queryFn: async () => {
      const response = await getDatas({ data: {
        table: "assets",
      }})

      if(response?.result){
        return response?.result?.map((vehicle: typeof assets.$inferSelect) => ({
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
          where: {
            designation: ["driver", "helper"],
          },
        },
      });

      const employees = response?.result ?? [];

      const mapEmployee = (employee: typeof employees.$inferSelect) => ({
        id: employee.id,
        name: employee.name,
        image: employee.image,
        email: employee.phone,
        designation: employee.designation,
      });

      return {
        drivers: employees
          .filter((employee: typeof employees.$inferSelect) => employee.designation === "driver")
          .map(mapEmployee),
        helpers: employees
          .filter((employee: typeof employees.$inferSelect) => employee.designation === "helper")
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
      vehicleModal,
      setVehicleModal,
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
