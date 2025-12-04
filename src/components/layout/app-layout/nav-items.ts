import { NavigationType, NavItemType } from "@/lib/types";
import { BaggageClaim, Briefcase, BriefcaseBusiness, Contact, LayoutGrid, ListChecks, Mail, MapPin, MapPinned, MessageCircle, Settings, ShieldUser, Truck, Users, Wallet } from "lucide-react";

export const mainNavItems: NavigationType[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutGrid,
      },
    ]
  },
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
  {
    title: "Services",
    items: [
      {
        title: "Depot Trips",
        href: "/services/regal-transtrade/depot",
        icon: BaggageClaim,
      },
      // {
      //   title: "District Trips",
      //   href: "/services/regal-transtrade/district",
      //   icon: MapPinned,
      // },
    ]
  },
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
  {
    title: "Assets",
    items: [
      {
        title: "Vehicles",
        href: "/assets",
        icon: Truck,
      },
    ]
  },
  {
    title: "CRM",
    items: [
      {
        title: "Customers",
        href: "/partners/customers",
        icon: Briefcase,
      },
      {
        title: "Contacts",
        href: "/partners/contacts",
        icon: Contact,
      },
    ],
  },
  {
    title: "HRM",
    items: [
      {
        title: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        title: "Designations",
        href: "/designations",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "Accounts",
    items: [
      {
        title: "Invoices",
        href: "/invoices/regal-transtrade",
        icon: Wallet,
      },
    ],
  },
  // {
  //   title: "Organization",
  //   items: [
  //     {
  //       title: "Settings",
  //       href: "/settings/partner-types",
  //       icon: Settings,
  //     },
  //     {
  //       title: "Members",
  //       href: "/members",
  //       icon: Users,
  //     }
  //   ],
  // },
]

export const footerNavItems: NavItemType[] = []
