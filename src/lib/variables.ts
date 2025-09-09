import appCss from "@/styles/app.css?url"

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
      title: "Tanstack Starter",
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

export const defaultPageSize = 10