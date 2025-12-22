import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { organizations } from "../db/schema"
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
export const routeId = "Pawvh3IKhrYGWmWSgXls7K7E33fTG76f";
export const organizationId = "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT";
export const portlinkPartnerId = "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf";
export const vehicleAssetTypeId = "kP47g0lpyblJWVgH0XTHEWh3ftZMhuk0";
export const customerPartnerRoleId = "1PQhbUmSdby5TQnZzBOq7EL1v4iUlbCv";
export const depotTripServiceTypeId = "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM";
export const districtTripServiceTypeId = "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I";

export const syncRegalTranstrade = createServerFn({ method: "POST" })
  .handler(async () => {

    console.log("Start Sync")

    // Update organization metadata
    
    await db.update(organizations).set({
      metadata: JSON.stringify({
        assetTypes: [{ id: vehicleAssetTypeId, name: "Vehicle" }],
        partnerRoles: [{ id: customerPartnerRoleId, name: "Customer" }],
        routeConfigs: [{ id: routeId, routes: tripRoutesDepot }],
        fuelPrice: fuelPrice
      })
    }).where(eq(organizations.id, organizationId))

    // 4. Optional: Delete migrated services and their entities
    // Uncomment the following lines if you want to delete the old data
    /*
    console.log("Deleting old service entities...")
    await db.delete(serviceEntities).where(and(
      eq(serviceEntities.organizationId, organizationId),
      eq(serviceEntities.serviceId, depotServices.map(s => s.id))
    ))

    console.log("Deleting old services...")
    await db.delete(services).where(and(
      eq(services.typeId, depotTripServiceTypeId),
      eq(services.organizationId, organizationId)
    ))
    */

    console.log("End Sync")
  })
