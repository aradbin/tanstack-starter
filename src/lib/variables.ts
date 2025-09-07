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
  "/forgot-password",
  "/reset-password",
]

export const designations = [
  {
    id: "driver",
    name: "Driver"
  },
  {
    id: "helper",
    name: "Helper"
  },
  {
    id: "office-staff",
    name: "Office Staff"
  },
]

export const tripRoutesDepot = [
  { from: "CPA", to: "PL", fuel: 24, cost: 24 },
  { from: "PL", to: "KDS", fuel: 14, cost: 10 },
  { from: "PL", to: "BM", fuel: 12, cost: 10 },
  { from: "PL", to: "SAPL", fuel: 7 , cost: 5 },
  { from: "PL", to: "OCL", fuel: 7 , cost: 5 },
  { from: "PL", to: "VERTEX", fuel: 7 , cost: 5 },
  { from: "PL", to: "EBIL", fuel: 5 , cost: 5 },
  { from: "PL", to: "CCTCL", fuel: 5 , cost: 5 },
  { from: "PL", to: "GCL", fuel: 12, cost: 7 },
  { from: "PL", to: "SML", fuel: 14, cost: 10 },
  { from: "PL", to: "ISATL", fuel: 14, cost: 7 },
  { from: "PL", to: "K&T", fuel: 3 , cost: 3.5 },
  { from: "PL", to: "QNS", fuel: 3 , cost: 3.5 },
  { from: "PL", to: "NCL", fuel: 15, cost: 13.5 },
  { from: "PL", to: "ICL", fuel: 10, cost: 7 },
  // { from: "PL", to: "PCT (Import)", fixed: 2700 },
  // { from: "PL", to: "PCT (Export)", fixed: 2000 },
]

export const fuelPrice = 120

export const defaultPageSize = 10