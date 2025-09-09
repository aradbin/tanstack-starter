import { NavigationType, NavItemType } from "@/lib/types";
import { BaggageClaim, Briefcase, BriefcaseBusiness, Contact, LayoutGrid, ListChecks, Mail, MessageCircle, ShieldUser, Truck, Users } from "lucide-react";

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
        href: "/assets",
        icon: Truck,
      },
      {
        title: "Depot Trips",
        href: "/events/regal-transtrade/depot",
        icon: BaggageClaim,
      },
      {
        title: "Designations",
        href: "/designations",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        title: "Members",
        href: "/members",
        icon: Users,
      }
    ],
  },
  {
    title: "Tasks",
    items: [
      {
        title: "All Tasks",
        href: "/tasks",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        title: "Contacts",
        href: "/contacts",
        icon: Contact,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "WhatsApp",
        href: "/whatsapp",
        icon: MessageCircle,
      },
      {
        title: "Email",
        href: "/email",
        icon: Mail,
      },
    ],
  },
]

export const footerNavItems: NavItemType[] = []
