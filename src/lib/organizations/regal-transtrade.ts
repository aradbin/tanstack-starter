import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { invoiceEntities, organizations, serviceEntities, services, trips } from "../db/schema"
import { and, eq } from "drizzle-orm"
import { generateId } from "better-auth"
import { AnyType } from "../types"
import { formatDateForInput } from "../utils"

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
export const depotTripServiceTypeId = "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM";
export const districtTripServiceTypeId = "zeA6cPLyvfLXMFXOs5fsi4SPpKatGm3I";

export const syncRegalTranstrade = createServerFn({ method: "POST" })
  .handler(async () => {

    console.log("Start migration")

    // Update organization metadata
    
    await db.update(organizations).set({
      metadata: JSON.stringify({
        assetTypes: [{ id: vehicleAssetTypeId, name: "Vehicle" }],
        partnerRoles: [{ id: generateId(), name: "Contact" }, { id: generateId(), name: "Customer" }],
        serviceTypes: [
          { id: depotTripServiceTypeId, name: "Depot Trip" },
          { id: districtTripServiceTypeId, name: "District Trip" }
        ],
        routeConfigs: [{ id: routeId, routes: tripRoutesDepot }],
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

    // 3. Migrate depot services to trips table
    console.log("Fetching depot services...")
    const depotServices = await db.query.services.findMany({
      where: and(
        eq(services.typeId, depotTripServiceTypeId),
        eq(services.organizationId, organizationId)
      ),
      with: {
        serviceEntities: true
      }
    })

    console.log(`Found ${depotServices.length} depot services to migrate`)

    // Prepare all trip records for batch insert
    const tripRecords = depotServices.map((service) => {
      const metadata = service.metadata as AnyType
      const items = metadata?.items || []
      const expenses = metadata?.expenses || []
      const serviceFuelPrice = metadata?.fuelPrice || fuelPrice

      // Find vehicle, driver, helper from serviceEntities
      const vehicleEntity = service.serviceEntities?.find((entity) =>
        entity.entityType === "assets" && entity.role === "vehicle"
      )
      const driverEntity = service.serviceEntities?.find((entity) =>
        entity.entityType === "employees" && entity.role === "driver"
      )
      const helperEntity = service.serviceEntities?.find((entity) =>
        entity.entityType === "employees" && entity.role === "helper"
      )

      // Calculate aggregated values
      const count = items.reduce((acc: number, item: AnyType) => acc + (item?.count || 0), 0)
      const fuel = items.reduce((acc: number, item: AnyType) =>
        acc + ((item?.route?.expense?.fuel || 0) * (item?.count || 0)), 0
      )
      const income = items.reduce((acc: number, item: AnyType) =>
        acc + ((((item?.route?.income?.fuel || 0) * serviceFuelPrice) + (item?.route?.income?.fixed || 0)) * (item?.count || 0)), 0
      )
      const expense = expenses.reduce((acc: number, expense: AnyType) =>
        acc + (expense?.amount || 0), 0
      )

      return {
        id: service.id,
        type: "depot",
        date: formatDateForInput(new Date(service.from)),
        vehicleId: vehicleEntity?.entityId || null,
        driverId: driverEntity?.entityId || null,
        helperId: helperEntity?.entityId || null,
        items: items,
        expenses: expenses,
        count: count.toString(),
        fuel: fuel.toString(),
        income: income.toString(),
        expense: expense.toString(),
        routes: routeId,
        fuelPrice: serviceFuelPrice.toString(),
        organizationId: service.organizationId,
        createdAt: service.createdAt,
        createdBy: service.createdBy,
        updatedAt: service.updatedAt,
        updatedBy: service.updatedBy,
      }
    })

    // Batch insert all trips
    if (tripRecords.length > 0) {
      console.log(`Inserting ${tripRecords.length} trips in batch...`)
      await db.insert(trips).values(tripRecords)
      console.log(`Migration complete: ${tripRecords.length} trips inserted successfully`)
    } else {
      console.log("No trips to migrate")
    }

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

    console.log("End migration")
  })
