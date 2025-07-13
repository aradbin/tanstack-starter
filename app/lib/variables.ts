import { LayoutGrid, ListChecks, Users } from "lucide-react"

import { NavigationType, NavItemType } from "@/lib/types"
import appCss from "@/styles/globals.css?url"

export const head = {
  meta: [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "TanStack Starter",
    },
  ],
  links: [
    {
      rel: "stylesheet",
      href: appCss,
    },
  ],
}

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

export const mainNavItems: NavigationType[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutGrid,
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
      },
      {
        title: "Teams",
        href: "/teams",
        icon: Users,
      },
      // {
      //   title: "Fallback",
      //   icon: LayoutGrid,
      //   items: [
      //     {
      //       title: "Coming Soon",
      //       href: "/pages/coming-soon",
      //     },
      //     {
      //       title: "Not Found 404",
      //       href: "/pages/not-found-404",
      //     },
      //     {
      //       title: "Unauthorized 401",
      //       href: "/pages/unauthorized-401",
      //     },
      //     {
      //       title: "Maintenance",
      //       href: "/pages/maintenance",
      //     },
      //   ],
      // },
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
]

export const footerNavItems: NavItemType[] = []

export const defaultPageSize = 1