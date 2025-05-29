import { BookOpen, Folder, LayoutGrid } from "lucide-react"

import { NavigationType, NavItem } from "@/lib/types"

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
    title: "Pages",
    items: [
      {
        title: "Landing",
        href: "#",
        label: "Soon",
        icon: LayoutGrid,
      },
      {
        title: "Fallback",
        icon: LayoutGrid,
        items: [
          {
            title: "Coming Soon",
            href: "/pages/coming-soon",
          },
          {
            title: "Not Found 404",
            href: "/pages/not-found-404",
          },
          {
            title: "Unauthorized 401",
            href: "/pages/unauthorized-401",
          },
          {
            title: "Maintenance",
            href: "/pages/maintenance",
          },
        ],
      },
    ],
  },
]

export const footerNavItems: NavItem[] = []
