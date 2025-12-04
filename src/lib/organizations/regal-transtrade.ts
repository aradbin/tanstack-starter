import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { organizations, services } from "../db/schema"
import { eq } from "drizzle-orm"

export const tripRoutesDepot = [
  { from: "CPA", to: "PL", income: {
    fuel: 0,
    fixed: 5900,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 24,
    fixed: 0,
    toll: 90,
    tips: 710
  }},
  { from: "PL", to: "KDS", income: {
    fuel: 14,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 10,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "BM", income: {
    fuel: 12,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 10,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "SAPL", income: {
    fuel: 7,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "OCL", income: {
    fuel: 7,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "VERTEX", income: {
    fuel: 7,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "EBIL", income: {
    fuel: 5,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "CCTCL", income: {
    fuel: 5,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "GCL", income: {
    fuel: 12,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 7,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "SML", income: {
    fuel: 14,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 10,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "ISATL", income: {
    fuel: 14,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 7,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "K&T", income: {
    fuel: 3,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 3.5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "QNS", income: {
    fuel: 3,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 3.5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "NCL", income: {
    fuel: 15,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 13,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "ICL", income: {
    fuel: 10,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 7,
    fixed: 0,
    toll: 0, 
    tips: 0
  }},
  { from: "PL", to: "ELL", income: {
    fuel: 5,
    fixed: 500,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 5,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
  { from: "PL", to: "PCT (Import)", income: {
    fuel: 0,
    fixed: 2700,
    toll: 0,
    tips: 0,
  }, expense: {
    fuel: 17,
    fixed: 0,
    toll: 0,
    tips: 200
  }},
  { from: "PL", to: "PCT (Export)", income: {
    fuel: 0,
    fixed: 2000,
    toll: 0,
    tips: 0
  }, expense: {
    fuel: 12,
    fixed: 0,
    toll: 0,
    tips: 0
  }},
]

export const fuelPrice = 102;
export const portlinkPartnerId = "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf";
export const depotTripServiceTypeId = "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM";
export const districtTripServiceTypeId = "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I";

export const syncRegalTranstrade = createServerFn({ method: "POST" })
  .handler(async () => {
    
    console.log("Start")

    await db.update(organizations).set({
      metadata: JSON.stringify({
        tripRoutesDepot: tripRoutesDepot,
        fuelPrice: fuelPrice
      })
    }).where(eq(organizations.id, "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT"))

    console.log("1")

    const depotServices = await db.select().from(services).where(eq(services.typeId, depotTripServiceTypeId))

    console.log("2")

    depotServices?.forEach(async (depotService: typeof services.$inferSelect & { metadata: any }) => {
      await db.update(services).set({
        metadata: {
          routes: tripRoutesDepot,
          fuelPrice: fuelPrice,
          expenses: depotService?.metadata?.expenses,
          items: depotService?.metadata?.items?.map((item: any) => ({
            count: item.count,
            route: tripRoutesDepot?.find(route => route.from === item.route.from && route.to === item.route.to)
          }))
        }
      }).where(eq(services.id, depotService.id))
    })

    console.log("End")
  })
