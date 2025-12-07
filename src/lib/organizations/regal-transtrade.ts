import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { invoiceEntities, organizations, serviceEntities, services } from "../db/schema"
import { and, eq } from "drizzle-orm"
import { generateId } from "better-auth"

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
export const organizationId = "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT";
export const portlinkPartnerId = "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf";
export const depotTripServiceTypeId = "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM";
export const districtTripServiceTypeId = "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I";

export const syncRegalTranstrade = createServerFn({ method: "POST" })
  .handler(async () => {
    
    console.log("Start")

    await db.update(organizations).set({
      metadata: JSON.stringify({
        assetTypes: [{ id: "kP47g0lpyblJWVgH0XTHEWh3ftZMhuk0", name: "Vehicle" }],
        eventTypes: [],
        partnerRoles: [{ id: generateId(), name: "Contact" }, { id: generateId(), name: "Customer" }],
        serviceTypes: [
          { id: depotTripServiceTypeId, name: "Depot Trip" },
          { id: districtTripServiceTypeId, name: "District Trip" }
        ],
        tripRoutesDepot: tripRoutesDepot,
        fuelPrice: fuelPrice
      })
    }).where(eq(organizations.id, organizationId))

    // 1. delete customer service entities
    await db.delete(serviceEntities).where(and(
      eq(serviceEntities.entityType, "partners"),
      eq(serviceEntities.role, "customer"),
      eq(serviceEntities.organizationId, organizationId)
    ))

    // 2. delete trips from invoice entities
    await db.delete(invoiceEntities).where(and(
      eq(invoiceEntities.entityType, "services"),
      eq(invoiceEntities.role, "trip"),
      eq(invoiceEntities.organizationId, organizationId)
    ))

    console.log("End")
  })
