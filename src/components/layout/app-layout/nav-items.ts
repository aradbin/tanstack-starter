import { NavigationType, NavItemType } from "@/lib/types";
import { BaggageClaim, Briefcase, Contact, LayoutGrid, ListChecks, Mail, MapPinHouse, MessageCircle, Truck, Users, Warehouse } from "lucide-react";

export const mainNavItems: NavigationType[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutGrid,
      },
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        title: "Vehicles",
        href: "/vehicles",
        icon: Truck,
      },
      {
        title: "Depot Trips",
        href: "/trips/depot",
        icon: BaggageClaim,
      },
    ],
  },
  // {
  //   title: "Organization",
  //   items: [
  //     {
  //       title: "Members",
  //       href: "/members",
  //       icon: Users,
  //     }
  //   ],
  // },
  // {
  //   title: "Tasks",
  //   items: [
  //     {
  //       title: "All Tasks",
  //       href: "/tasks",
  //       icon: ListChecks,
  //     },
  //   ],
  // },
  // {
  //   title: "CRM",
  //   items: [
  //     {
  //       title: "Contacts",
  //       href: "/contacts",
  //       icon: Contact,
  //     },
  //     {
  //       title: "Customers",
  //       href: "/customers",
  //       icon: Briefcase,
  //     },
  //   ],
  // },
  // {
  //   title: "Communication",
  //   items: [
  //     {
  //       title: "WhatsApp",
  //       href: "/whatsapp",
  //       icon: MessageCircle,
  //     },
  //     {
  //       title: "Email",
  //       href: "/email",
  //       icon: Mail,
  //     },
  //   ],
  // },
]

export const footerNavItems: NavItemType[] = []
