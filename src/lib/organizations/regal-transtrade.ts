import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { assets, assetTypes, employees, eventEntities, events, eventTypes, serviceEntities, services, serviceTypes } from "../db/schema"
import { endOfDay } from "date-fns"
import { generateId } from "better-auth"
import { and, eq, isNull } from "drizzle-orm"

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

export const fuelPrice = 102

export const syncRegalTranstrade = createServerFn({ method: "POST" })
  .handler(async () => {
    // await db.insert(assetTypes).values({
    //   id: "kP47g0lpyblJWVgH0XTHEWh3ftZMhuk0",
    //   name: "Vehicle",
    //   parent_id: null,
    //   organization_id: "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    // })

    // const assetArray = assetsBackup?.filter((asset) => asset?.deleted_at === null)?.map((asset) => ({
    //   id: asset?.id,
    //   typeId: "kP47g0lpyblJWVgH0XTHEWh3ftZMhuk0",
    //   organizationId: "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    //   metadata: {
    //     "registrationDate": asset?.registration_date,
    //     "fitnessExpiryDate": "",
    //     "registrationNumber": asset?.registration_number,
    //     "taxTokenExpiryDate": "",
    //     "roadPermitExpiryDate": ""
    //   },
    //   createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    // }))
    // await db.insert(assets).values(assetArray)

    // const employeeArray = employeesBackup?.filter((employee) => employee?.deleted_at === null)?.map((employee) => ({
    //   id: employee?.id,
    //   name: employee?.name,
    //   phone: employee?.phone,
    //   designationId: employee?.designation === "driver" ? "hB7xWkGlz66r3GjGqDe8C4It7GJkCnQd" : employee?.designation === "helper" ? "YGqSebqvFm4F3eaCWyUrv5BH7yarRt51" : "B7zZasyxzO7qhBzLXy3H5jWwHFmCE2pV",
    //   organizationId: "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    //   createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    // }))
    // await db.insert(employees).values(employeeArray)

    // eventsBackup?.filter((event) => event?.deleted_at === null)?.forEach(async (event) => {
    //   const items = event?.items?.map((item) => {
    //     return {
    //       route: tripRoutesDepot.find((route) => route.from === item.from && route.to === item.to),
    //       count: item.count,
    //     }
    //   })
    //   const expenses = {
    //     toll: 0,
    //     tips: 0,
    //     fuel: 0
    //   }
    //   items.forEach((item) => {
    //     if (item.route) {
    //       expenses.toll += item.route.expense.toll * item.count
    //       expenses.tips += item.route.expense.tips * item.count
    //       expenses.fuel += item.route.expense.fuel * item.count * (fuelPrice || 0)
    //     }
    //   })
    //   const [result] = await db.insert(events).values({
    //     id: event?.id,
    //     from: new Date(event?.date),
    //     to: endOfDay(new Date(event?.date)),
    //     status: "completed",
    //     attachments: null,
    //     typeId: "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
    //     organizationId: "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    //     metadata: {
    //       items: items,
    //       expenses: [
    //         { description: "Toll", amount: expenses.toll },
    //         { description: "Tips", amount: expenses.tips },
    //         { description: "Fuel", amount: expenses.fuel },
    //       ],
    //       routes: tripRoutesDepot,
    //       fuelPrice: fuelPrice
    //     },
    //     createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u",
    //   }).returning()

    //   await db.insert(eventEntities).values([
    //     {
    //       id: generateId(),
    //       role: "customer",
    //       status: "attended",
    //       entityType: "customers",
    //       entityId: "64g2kKyWEyk7pAMojDhDu5o8nQRWN5qf",
    //       eventId: result?.id,
    //       createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    //     },
    //     {
    //       id: generateId(),
    //       role: "vehicle",
    //       status: "attended",
    //       entityType: "assets",
    //       entityId: event?.vehicle_id,
    //       eventId: result?.id,
    //       createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    //     },
    //     {
    //       id: generateId(),
    //       role: "driver",
    //       status: "attended",
    //       entityType: "employees",
    //       entityId: event?.driver_id,
    //       eventId: result?.id,
    //       createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    //     },
    //     ...event?.helper_id ? [{
    //       id: generateId(),
    //       role: "helper",
    //       status: "attended",
    //       entityType: "employees",
    //       entityId: event?.helper_id,
    //       eventId: result?.id,
    //       createdBy: "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u"
    //     }] : [],
    //   ])
    // })

    // const allEventTypes = await db.select().from(eventTypes)
    // const allEvents = await db.select().from(events)
    // const allEventEntities = await db.select().from(eventEntities)
    
    // await db.insert(serviceTypes).values(allEventTypes)
    // await db.insert(services).values(allEvents)
    // await db.insert(serviceEntities).values(allEventEntities?.map((entity) => (
    //    {
    //     ...entity,
    //     serviceId: entity?.eventId,
    //   }
    // )))

    // await db.update(serviceEntities).set({ entityType: "partners" }).where(eq(serviceEntities.entityType, "customers"))
})

export const assetTypesBackup = [
  {
    "id": "kP47g0lpyblJWVgH0XTHEWh3ftZMhuk0",
    "name": "Vehicle",
    "parent_id": null,
    "organization_id": "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    "created_at": "2025-09-09 20:14:27.703566",
    "updated_at": "2025-09-09 20:14:27.703566",
    "deleted_at": null,
    "created_by": null,
    "updated_by": null,
    "deleted_by": null
  }
]

export const assetsBackup = [
  {
    "id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "registration_number": "CMDha 81-0538",
    "registration_date": "2009-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:42:29.141829",
    "updated_at": "2025-09-06 06:42:29.141829",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "registration_number": "CMDha 81-0195",
    "registration_date": "2012-09-13",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:49:27.685212",
    "updated_at": "2025-09-06 06:49:27.685212",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "registration_number": "DMDha 84-0212",
    "registration_date": "2014-09-16",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:47:19.633663",
    "updated_at": "2025-09-06 06:47:19.633663",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "9W2o04aj5ExRGBXGBAGQsAOR2JimfBbv",
    "registration_number": "CMDha 81-0539",
    "registration_date": "2009-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:42:42.277918",
    "updated_at": "2025-09-06 06:42:42.277918",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "registration_number": "CMDha 81-0936",
    "registration_date": "2012-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:45:19.246284",
    "updated_at": "2025-09-06 06:45:19.246284",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "CCj4Vlt5BNyuQosjhoEMWohPcxaOFPrW",
    "registration_number": "DMD ha-81-0043",
    "registration_date": "2025-08-01",
    "chassis_number": "32432",
    "engine_number": "234234",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 08:55:41.517279",
    "updated_at": "2025-08-28 08:55:41.517279",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "registration_number": "CMDha 81-0261",
    "registration_date": "2009-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:40:34.95595",
    "updated_at": "2025-09-06 06:40:34.95595",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "GGDlBgte9egoCVpayhOZxTopRzBaysMj",
    "registration_number": "CMDha 81-0504",
    "registration_date": "2013-09-12",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:49:47.760008",
    "updated_at": "2025-09-06 06:49:47.760008",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "HTHKv7jT5DNXfQW6zmIsEFpKXDJVlVrp",
    "registration_number": "CMDha 81-0262",
    "registration_date": "2009-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:41:13.216693",
    "updated_at": "2025-09-06 06:41:13.216693",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "MrJv58DqwK2xdkdm53P50EMmUA0JWQBW",
    "registration_number": "DMDha 84-0102",
    "registration_date": "2014-09-17",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:48:16.641549",
    "updated_at": "2025-09-06 06:48:16.641549",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "registration_number": "CMEha 81-0261",
    "registration_date": "2004-09-09",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:50:20.920907",
    "updated_at": "2025-09-06 06:50:20.920907",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "registration_number": "CMDha 81-1228",
    "registration_date": "2012-09-07",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:45:43.666298",
    "updated_at": "2025-09-06 06:45:43.666298",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "registration_number": "CMDha 81-0926",
    "registration_date": "2012-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:43:17.914627",
    "updated_at": "2025-09-06 06:43:17.914627",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Vnn8ne1H1OHjvxMuEW4iu7YoOFgcifnm",
    "registration_number": "CMDha 81-0193",
    "registration_date": "2012-09-19",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:48:48.405798",
    "updated_at": "2025-09-06 06:48:48.405798",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "registration_number": "CMDha 81-0935",
    "registration_date": "2012-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:43:51.313677",
    "updated_at": "2025-09-06 06:43:51.313677",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "registration_number": "CMDha 81-0194",
    "registration_date": "2012-09-06",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:49:10.641023",
    "updated_at": "2025-09-06 06:49:10.641023",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "registration_number": "DMDha 84-0214",
    "registration_date": "2014-09-17",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:47:56.396262",
    "updated_at": "2025-09-06 06:47:56.396262",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "registration_number": "CMDha 81-1747",
    "registration_date": "2015-09-11",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:51:00.457384",
    "updated_at": "2025-09-06 06:51:00.457384",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "g0Y4f7zkrGov86zKeTvDimKDkMtjWqyy",
    "registration_number": "CMDha 81-0934",
    "registration_date": "2012-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:43:33.583195",
    "updated_at": "2025-09-06 06:43:33.583195",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "registration_number": "DMD ha-81-0045",
    "registration_date": "2025-07-22",
    "chassis_number": "utr45678",
    "engine_number": "vsdfou8s767",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 09:19:43.948649",
    "updated_at": "2025-08-28 09:19:43.948649",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "iYC02fjYtqnCl6uM8mOniIb1Pkcbo6dZ",
    "registration_number": "CMDha 81-0925",
    "registration_date": "2012-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:43:01.813722",
    "updated_at": "2025-09-06 06:43:01.813722",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "o5f5twfcd6mXXjJT5LVWruDnvOWbga0W",
    "registration_number": "DMDha 84-0176",
    "registration_date": "2014-09-05",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:46:21.06403",
    "updated_at": "2025-09-06 06:46:21.06403",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "registration_number": "CMDha 81-0987",
    "registration_date": "2014-09-12",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:50:42.687028",
    "updated_at": "2025-09-06 06:50:42.687028",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "registration_number": "DMDha 84-0177",
    "registration_date": "2014-09-01",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:47:00.176677",
    "updated_at": "2025-09-06 06:47:00.176677",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "registration_number": "DMDha 84-0213",
    "registration_date": "2014-09-17",
    "chassis_number": "",
    "engine_number": "",
    "fitness_expiry_date": null,
    "tax_token_expiry_date": null,
    "insurance_expiry_date": null,
    "type": null,
    "brand": null,
    "model": null,
    "year": null,
    "capacity": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:47:35.706099",
    "updated_at": "2025-09-06 06:47:35.706099",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  }
]

export const designationsBackup = [
  {
    "id": "B7zZasyxzO7qhBzLXy3H5jWwHFmCE2pV",
    "name": "Office Staff",
    "parent_id": null,
    "organization_id": "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    "created_at": "2025-09-09 20:12:51.458408",
    "updated_at": "2025-09-09 20:12:51.458408",
    "deleted_at": null,
    "created_by": "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "YGqSebqvFm4F3eaCWyUrv5BH7yarRt51",
    "name": "Helper",
    "parent_id": null,
    "organization_id": "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    "created_at": "2025-09-09 20:12:45.811121",
    "updated_at": "2025-09-09 20:12:45.811121",
    "deleted_at": null,
    "created_by": "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "hB7xWkGlz66r3GjGqDe8C4It7GJkCnQd",
    "name": "Driver",
    "parent_id": null,
    "organization_id": "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT",
    "created_at": "2025-09-09 20:12:39.819262",
    "updated_at": "2025-09-09 20:12:39.819262",
    "deleted_at": null,
    "created_by": "f1iMUVNmMmKYKMWim0WkxuKYAHSatN3u",
    "updated_by": null,
    "deleted_by": null
  }
]

export const employeesBackup = [
  {
    "id": "0AhoxNtKfTOstfsdP4NXy3NvNaqqOxOV",
    "name": "Sabbir",
    "email": null,
    "phone": "01825654585",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:15:10.20088",
    "updated_at": "2025-09-06 06:15:10.20088",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "0EDVFSBMexgDmoUZl38uf6aueW2J5Ode",
    "name": "Nur Nobi",
    "email": null,
    "phone": "01832526242",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:07:22.186557",
    "updated_at": "2025-09-06 06:07:22.186557",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "name": "Amin",
    "email": null,
    "phone": "01912287694",
    "nid": "",
    "dob": "2025-07-15",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:42:15.655861",
    "updated_at": "2025-09-06 05:42:15.655861",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "0RPdTcsD51c6NfIEf9lJiGdred2GsSx5",
    "name": "Hannan",
    "email": null,
    "phone": "01824569878",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:13:09.417399",
    "updated_at": "2025-09-06 06:13:09.417399",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "0TyVZYgi8pYtw82VNqPKij1xIMMzpArX",
    "name": "Ariful",
    "email": null,
    "phone": "01864238484",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:05:38.093759",
    "updated_at": "2025-09-06 06:05:38.093759",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "1OarhNxXAUa87yRtpJeE5vnPq34v381a",
    "name": "Mahabub alom",
    "email": null,
    "phone": "01631795368",
    "nid": "",
    "dob": "2025-09-05",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:32:09.394696",
    "updated_at": "2025-09-06 05:32:09.394696",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "1u9stqalyLh5FyI8QWtQQTvlZme5AOby",
    "name": "Rakib-2",
    "email": null,
    "phone": "01725456525",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:18:37.057009",
    "updated_at": "2025-09-06 06:18:37.057009",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "2DP98UlTnnX41UqdDZHVogFcpdB5jbQS",
    "name": "Yusuf",
    "email": null,
    "phone": "01872583652",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:49:29.593664",
    "updated_at": "2025-09-06 05:49:29.593664",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "4GuoAMAAHX9EHnYdMvv3wpDh3WoWICpz",
    "name": "Linkon",
    "email": null,
    "phone": "01838681976",
    "nid": "",
    "dob": "1987-09-22",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:17:48.713015",
    "updated_at": "2025-09-06 05:17:48.713015",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "4SV2QPtXI9s3Q8SEHvRWWzSqlluMhiuS",
    "name": "Ibrahim",
    "email": null,
    "phone": "01601918753",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:57:34.452078",
    "updated_at": "2025-09-06 05:57:34.452078",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "6ZRNf3t8b2tF4K7zMnhNOJvMGO9LnsrL",
    "name": "Habibul",
    "email": null,
    "phone": "01725835649",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:59:42.887874",
    "updated_at": "2025-09-06 05:59:42.887874",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "6vLgHfQF6twgfRei3rBYDZL3Y4WhkabI",
    "name": "Liton-2",
    "email": null,
    "phone": "01812054245",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:03:30.231872",
    "updated_at": "2025-09-06 06:03:30.231872",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "7D7mXFeeusJ1CsAFnTNQrkO0K4WkRBkK",
    "name": "Shablu",
    "email": null,
    "phone": "01835654875",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:17:14.019785",
    "updated_at": "2025-09-06 06:17:14.019785",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "7LvKa16Q45y8Hlkg4oVg9bBEH6t9J7TQ",
    "name": "Kamrul",
    "email": null,
    "phone": "01824563210",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:12:18.695008",
    "updated_at": "2025-09-06 06:12:18.695008",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "85T57qr4E40OKnEECNQqupnMi2qcwVRl",
    "name": "Salman",
    "email": null,
    "phone": "01905280120",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:49:58.353799",
    "updated_at": "2025-09-06 05:49:58.353799",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "8InOQATmmj7ljkiGJumTKu2HPmpJzw3J",
    "name": "Abdul Malek",
    "email": null,
    "phone": "01831514262",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:06:55.183329",
    "updated_at": "2025-09-06 06:06:55.183329",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "AAvbr5hwlUiNaPAoqyZcoo2ERvDwcPzz",
    "name": "Biplov",
    "email": null,
    "phone": "01826546320",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:11:19.339063",
    "updated_at": "2025-09-06 06:11:19.339063",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "AimSO1seuahDPk4FkPJlp4LaKo9mShqj",
    "name": "Jalal",
    "email": null,
    "phone": "01885208735",
    "nid": "",
    "dob": "2012-03-21",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:11:53.252554",
    "updated_at": "2025-09-06 05:11:53.252554",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "Aj9saWWqah2BRAd2DzeCruLS0NWc0H1h",
    "name": "Raju",
    "email": null,
    "phone": "01747961609",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:47:32.678516",
    "updated_at": "2025-09-06 05:47:32.678516",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "BMtTiYnajl4a8olR8IigCqHhTwoj5rHe",
    "name": "Liton 936",
    "email": null,
    "phone": "01850872064",
    "nid": "",
    "dob": "2025-09-25",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:23:28.349397",
    "updated_at": "2025-09-06 05:23:28.349397",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "DAm1hZzXUKVeoX2PIUbajP1xLelDzwv4",
    "name": "Jahed-2",
    "email": null,
    "phone": "01606727276",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:50:34.73236",
    "updated_at": "2025-09-06 05:50:34.73236",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "DZIdu4g4AGWEKV57J8TGrFBE1JulRYQh",
    "name": "Ovaidul",
    "email": null,
    "phone": "01894141619",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:54:11.878312",
    "updated_at": "2025-09-06 05:54:11.878312",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Dx1m4uEMUfWSHffUrWLjISdAB3vwngJa",
    "name": "Rajib",
    "email": null,
    "phone": "01824652110",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:12:48.727521",
    "updated_at": "2025-09-06 06:12:48.727521",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "E0k2sadtDu7gvUq7Idgi878rlH0lNF81",
    "name": "Babu(4men)",
    "email": null,
    "phone": "01819311981",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:22:05.726843",
    "updated_at": "2025-09-06 06:22:05.726843",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "E2OMdPHez5WRb74n570YYDpjaDbBJqSx",
    "name": "Econ(Denting mechanic)",
    "email": null,
    "phone": "01540003790",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:38:44.678074",
    "updated_at": "2025-09-06 06:38:44.678074",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "EC2rG1KPn7nkO7xhPR9WhF8ZyzjscH4F",
    "name": "Sajjad(Small engine mechanic)",
    "email": null,
    "phone": "01883391534",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:33:45.22664",
    "updated_at": "2025-09-06 06:33:45.22664",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "GVtfeKkgviESkTJuROhCm3sHWl8E7cqM",
    "name": "Amir hossen",
    "email": null,
    "phone": "01907964707",
    "nid": "",
    "dob": "2025-10-15",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:30:41.163367",
    "updated_at": "2025-09-06 05:30:41.163367",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "name": "Rubel-2",
    "email": null,
    "phone": "01684262451",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:04:10.711924",
    "updated_at": "2025-09-06 06:04:10.711924",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "name": "jahangir",
    "email": null,
    "phone": "01564836511",
    "nid": "",
    "dob": "2019-10-04",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:07:26.585356",
    "updated_at": "2025-09-06 05:07:26.585356",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "I5uhAqU9UhLeXLWsi4lzNV0nFgcJypvf",
    "name": "Masum",
    "email": null,
    "phone": "01825454212",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:17:38.723928",
    "updated_at": "2025-09-06 06:17:38.723928",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Ie8SwKGqNpISuqcBcvXfmZd8xRjlR8Cz",
    "name": "Hannan",
    "email": "",
    "phone": "01234567890",
    "nid": "32434645645645",
    "dob": "2025-08-19",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 05:14:41.105533",
    "updated_at": "2025-08-28 05:14:41.105533",
    "deleted_at": "2025-09-06 05:03:40.479",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  },
  {
    "id": "Jo7FhNNSyJdOEPFiQ4KXRFq4ek8l0Yzx",
    "name": "Emam((Small engine mechanic)",
    "email": null,
    "phone": "01892192757",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:32:27.322577",
    "updated_at": "2025-09-06 06:32:27.322577",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "KI2EeTyNn8JFK1SddVmgdE5V4mU9qkj4",
    "name": "Imran(Iron Mechanic head)",
    "email": null,
    "phone": "01831539824",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:30:02.690872",
    "updated_at": "2025-09-06 06:30:02.690872",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "KfVNTE8dwZr2TGrGDd3e7XU4jv7dOzfd",
    "name": "Bablu( Assistance mechanic)",
    "email": null,
    "phone": "01854643470",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:28:54.554168",
    "updated_at": "2025-09-06 06:28:54.554168",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "KpwIWAPJ5frNoGUc4z86pkzWiJVvQzBM",
    "name": "Driver 1",
    "email": "",
    "phone": "",
    "nid": "",
    "dob": "2025-08-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 04:51:05.576747",
    "updated_at": "2025-08-28 04:51:05.576747",
    "deleted_at": "2025-08-28 05:09:18.223",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  },
  {
    "id": "KuxPGrfu5d3qiVsUaQzeztHKCsXkZjvS",
    "name": "Abul Kalam",
    "email": "",
    "phone": "",
    "nid": "",
    "dob": "2025-08-07",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 05:13:51.504288",
    "updated_at": "2025-08-28 05:13:51.504288",
    "deleted_at": "2025-09-06 05:03:49.608",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  },
  {
    "id": "LsgJ3dnJnUtuMNNruGRFlzQY0tVtvmgG",
    "name": "Ridoy B",
    "email": null,
    "phone": "01608936298",
    "nid": "",
    "dob": "2025-09-02",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:34:44.161063",
    "updated_at": "2025-09-06 05:34:44.161063",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "MvNrEG3wdP6NdFUjSBd02iLFQnbk2bYM",
    "name": "Sajjad Hossen",
    "email": null,
    "phone": "01824529282",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:09:23.265543",
    "updated_at": "2025-09-06 06:09:23.265543",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "N0tccSqW8sdEEvGm2Abjsp3oZAV4AhYu",
    "name": "Rakib",
    "email": null,
    "phone": "01843360410",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:56:46.58335",
    "updated_at": "2025-09-06 05:56:46.58335",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "PTUxnNzDV3Xcl8QKe4t5rXN2qAqoPhwi",
    "name": "Jony",
    "email": null,
    "phone": "01832656867",
    "nid": "",
    "dob": "2012-09-04",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:29:17.741708",
    "updated_at": "2025-09-06 05:29:17.741708",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "QdkFfGVxPzlxe8nywMNYTIpW8M3thkIs",
    "name": "Jubayer",
    "email": null,
    "phone": "01842585955",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:48:53.447587",
    "updated_at": "2025-09-06 05:48:53.447587",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "RCOYMA3u5DRbs7DY1WpZJQSC0dcLq2nO",
    "name": "Osman ",
    "email": null,
    "phone": "01814045375",
    "nid": "",
    "dob": "2025-09-06",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:35:33.948369",
    "updated_at": "2025-09-06 05:35:33.948369",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "RIjP03s4l6FnnvO3hkRfW4EsHvsLaVar",
    "name": "Fazol",
    "email": null,
    "phone": "01621974210",
    "nid": "",
    "dob": "2019-10-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:06:18.420694",
    "updated_at": "2025-09-06 05:06:18.420694",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "RkOG8MNBcOF26hdGmpVshhr2Rbe6I9ye",
    "name": "Sobuj",
    "email": null,
    "phone": "01556677990",
    "nid": "",
    "dob": "2014-12-05",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:10:04.961647",
    "updated_at": "2025-09-06 05:10:04.961647",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "UCoW0hizmhrMf9ZF9uA1qxkkHDJcXBTi",
    "name": "Abdur Rahim",
    "email": "",
    "phone": "4567543",
    "nid": "123456576865",
    "dob": "2025-06-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-28 05:14:08.881464",
    "updated_at": "2025-08-28 05:14:08.881464",
    "deleted_at": "2025-09-06 05:03:43.818",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  },
  {
    "id": "UMd3PDf3Woh8hiVNK8qv2z8lRyaLGmNf",
    "name": "Sazzad",
    "email": null,
    "phone": "01826456525",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:18:58.115735",
    "updated_at": "2025-09-06 06:18:58.115735",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "UW6UtjxDCUGCZio8XXcxgrn4oTSedu7X",
    "name": "Rakib(Night 4men)",
    "email": null,
    "phone": "01763113195",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:25:53.867293",
    "updated_at": "2025-09-06 06:25:53.867293",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "VD18oFhJY2GG5XRwoGA45D6MF7nlvAJB",
    "name": "Sahed",
    "email": null,
    "phone": "01820339112",
    "nid": "",
    "dob": "2015-08-27",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:26:41.532578",
    "updated_at": "2025-09-06 05:26:41.532578",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "VjwqZSSMTL7Cl8hJFapyqAkp8Sjsz9Y4",
    "name": "Shoykot",
    "email": null,
    "phone": "01891647483",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:58:36.669866",
    "updated_at": "2025-09-06 05:58:36.669866",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "VuLITaZGSbc7We5E6DnILB0Fuw4e32kV",
    "name": "Ahad",
    "email": null,
    "phone": "01824569585",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:13:56.901399",
    "updated_at": "2025-09-06 06:13:56.901399",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "W0MWfXQ6bkwUA63NdRq4k3ZtiJzolTSl",
    "name": "Tareq",
    "email": null,
    "phone": "01836456525",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:18:08.663688",
    "updated_at": "2025-09-06 06:18:08.663688",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "WZWabKgfYZAwn5Scfe8Is64JvXirwQGJ",
    "name": "Babul",
    "email": null,
    "phone": "01824565610",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:14:22.84034",
    "updated_at": "2025-09-06 06:14:22.84034",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Wk2uXw2AJdIBuW228DwOVHMP7i0TuMMq",
    "name": "Aorup",
    "email": null,
    "phone": "01564836511",
    "nid": "",
    "dob": "2025-10-27",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 12:32:21.316432",
    "updated_at": "2025-09-06 12:32:21.316432",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Xa9RR4pYzgkrgYGAzeHWIDzHEDlqQfP9",
    "name": "Sahadat",
    "email": null,
    "phone": "01885115062",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:55:47.566569",
    "updated_at": "2025-09-06 05:55:47.566569",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "XayDWmlkjbCu6sTIvi79nnKpMxc2ge7u",
    "name": "Rony",
    "email": null,
    "phone": "01865452521",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:16:05.596623",
    "updated_at": "2025-09-06 06:16:05.596623",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "Y2pURKh3HUqhKf7MXwBy1afjj7fD54zq",
    "name": "Aktar",
    "email": null,
    "phone": "01858446125",
    "nid": "",
    "dob": "2025-08-30",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:24:25.518157",
    "updated_at": "2025-09-06 05:24:25.518157",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "cIfB0EGkrpIFe3GiCoFLaJVIYlVAO5vA",
    "name": "Fazol",
    "email": null,
    "phone": "01234567895",
    "nid": "",
    "dob": "2017-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:01:13.551149",
    "updated_at": "2025-09-06 05:01:13.551149",
    "deleted_at": "2025-09-06 05:03:16.823",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  },
  {
    "id": "cMRDaBc8zlbYYfyppIjx8fBB7fxpDjKc",
    "name": "Tonmoy",
    "email": null,
    "phone": "01825456525",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:16:48.017636",
    "updated_at": "2025-09-06 06:16:48.017636",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "dB408WNnJuFRGQ5iV7WC66nmjNWg2Rri",
    "name": "Arif",
    "email": null,
    "phone": "01846807560",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:46:54.429698",
    "updated_at": "2025-09-06 05:46:54.429698",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "fAGBcLhZfXdMIVOLt0r2fyYGoxomQ8rH",
    "name": "Arshad",
    "email": null,
    "phone": "01820310226",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:51:21.371568",
    "updated_at": "2025-09-06 05:51:21.371568",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "ffbRRb6BqfEtRzmkSPJEtrZVZ5qQRacb",
    "name": "Faisal",
    "email": null,
    "phone": "01824569858",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:13:33.437954",
    "updated_at": "2025-09-06 06:13:33.437954",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "gNs6dVrLCP6KpEb0FRDrf9ToZjiTkhdF",
    "name": "R. Korim",
    "email": null,
    "phone": "01826525211",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:05:07.352374",
    "updated_at": "2025-09-06 06:05:07.352374",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "gSURSKtmBYINOVdJPLUUAYoiKI2o7HrY",
    "name": "HASAN(Manager)",
    "email": null,
    "phone": "08161696750",
    "nid": "",
    "dob": "1987-07-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:20:17.663892",
    "updated_at": "2025-09-06 06:20:17.663892",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "gyk8qtQt17LMpyXxJUsgxPZ7UcJGNGdn",
    "name": "Ashraf ",
    "email": null,
    "phone": "01660105450",
    "nid": "",
    "dob": "2025-09-02",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:32:57.222486",
    "updated_at": "2025-09-06 05:32:57.222486",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "hxgNomXIT5NqZI8yvDqqwt5evDIPCaA6",
    "name": "Farid",
    "email": null,
    "phone": "01660108276",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:02:44.441713",
    "updated_at": "2025-09-06 06:02:44.441713",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "jvhuoR4El96L2mir8RICg3ycWqRW2GpY",
    "name": "Foyez",
    "email": null,
    "phone": "01919653760",
    "nid": "",
    "dob": "2023-09-29",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:25:36.743459",
    "updated_at": "2025-09-06 05:25:36.743459",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "jyumCMBVD13ZqzBkWqeOymHUfQhpleEj",
    "name": "Jabed(Denting mechanic)",
    "email": null,
    "phone": "01642774083",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:34:41.334079",
    "updated_at": "2025-09-06 06:34:41.334079",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "lQ4SZ1PUvl0nHktcszFddMj9XPggpTut",
    "name": "Humayun(Head Mechanic)",
    "email": null,
    "phone": "01843774804",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:27:27.545611",
    "updated_at": "2025-09-06 06:27:27.545611",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "mIunKdxCwzMS5GML4RLuHkgSg7ifHokj",
    "name": "Karim ",
    "email": null,
    "phone": "01812037533",
    "nid": "",
    "dob": "1987-06-25",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:13:53.77523",
    "updated_at": "2025-09-06 05:13:53.77523",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "nEUjeKz8BksoYwpno3rzeqFxZhYdNRGQ",
    "name": "Sujun",
    "email": null,
    "phone": "01606666503",
    "nid": "",
    "dob": "1998-07-05",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:40:54.497073",
    "updated_at": "2025-09-06 05:40:54.497073",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "oa3Krcv1JvZ490I12AUmyXDJmkVRS71C",
    "name": "Hasan",
    "email": null,
    "phone": "01325241710",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:46:24.726219",
    "updated_at": "2025-09-06 05:46:24.726219",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "pG1NRjvaIpbyfCZ70HEPtpQX6Q8erFZB",
    "name": "Rana",
    "email": null,
    "phone": "01825456545",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:14:48.266642",
    "updated_at": "2025-09-06 06:14:48.266642",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "qWTv4pp7ZhuNEnquazgkhs7XrzSSHP3c",
    "name": "Mohiuddin(4men)",
    "email": null,
    "phone": "01840230534",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:21:23.943703",
    "updated_at": "2025-09-06 06:21:23.943703",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "qcSB3Lk62MwoL4rh5lO7fcv2QZK4SYBd",
    "name": "Sohidul",
    "email": null,
    "phone": "01821524565",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:08:44.936515",
    "updated_at": "2025-09-06 06:08:44.936515",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "sgNDtVQownSMV2O9sNnNHiq5OeD2EXQd",
    "name": "Kamrul",
    "email": null,
    "phone": "01829835575",
    "nid": "",
    "dob": "2018-09-13",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:08:45.701832",
    "updated_at": "2025-09-06 05:08:45.701832",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "uTpAVEHgWpwDFnOPHsBNB8dTNjT6kkWX",
    "name": "Badsha",
    "email": null,
    "phone": "01972114300",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:06:14.621305",
    "updated_at": "2025-09-06 06:06:14.621305",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "uVIrWmymQJDh9m73jQMQJjmKtBXqsmIo",
    "name": "Alamin",
    "email": null,
    "phone": "01610130145",
    "nid": "",
    "dob": "2025-10-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:39:53.659595",
    "updated_at": "2025-09-06 05:39:53.659595",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "v5OK37Li2YY1AhCa3hDlYXeVMZogz5aZ",
    "name": "Jahed",
    "email": null,
    "phone": "01994410626",
    "nid": "",
    "dob": "2015-08-11",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:28:08.597939",
    "updated_at": "2025-09-06 05:28:08.597939",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "v6bdGV0IemmZwryITC4SyjFmioGwD4DJ",
    "name": "Jafor",
    "email": null,
    "phone": "01824654565",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:09:44.160932",
    "updated_at": "2025-09-06 06:09:44.160932",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "v7osuBp7myXCPhcW5y7X7VpxXh9e9X5k",
    "name": "Nur Hossen",
    "email": null,
    "phone": "01881533467",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:00:14.89819",
    "updated_at": "2025-09-06 06:00:14.89819",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "vnVFRtoBCtVD16YwCiY5P0xiGsmVkgzs",
    "name": "Liton (dist)",
    "email": null,
    "phone": "01967771074",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:01:24.480745",
    "updated_at": "2025-09-06 06:01:24.480745",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "vopFQ2gwq7V44kMnzjkHVUy9F4vzbso9",
    "name": "Jahangir-2",
    "email": null,
    "phone": "01722173157",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:59:13.990588",
    "updated_at": "2025-09-06 05:59:13.990588",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "w8RKTSup3qhho7AJzMDkqq35FJy6zd7u",
    "name": "Sahabuddin",
    "email": null,
    "phone": "01824526242",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:10:15.996913",
    "updated_at": "2025-09-06 06:10:15.996913",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "wnLGePrpi3vDTAr4BZ6OGuHoD9j508KI",
    "name": "Rakib-T",
    "email": null,
    "phone": "01825654585",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:15:37.383467",
    "updated_at": "2025-09-06 06:15:37.383467",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "wzzcBp4c7xf4ygTVizKmEz0ZlktFmQgM",
    "name": "Rifat",
    "email": null,
    "phone": "01825456552",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "helper",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:16:26.093815",
    "updated_at": "2025-09-06 06:16:26.093815",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "xL8N1uWi79QqhfclQszd92HsXtuPOwhm",
    "name": "Farhad",
    "email": null,
    "phone": "01609660730",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:43:30.225343",
    "updated_at": "2025-09-06 05:43:30.225343",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "y0thxCf1Wq3axyQo4zIOO9idnVRvMMuN",
    "name": "Rashed(Denting mechanic)",
    "email": null,
    "phone": "01333401714",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:37:39.78331",
    "updated_at": "2025-09-06 06:37:39.78331",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "y8BvIksfEt4DOLfEMXT0IOjYki6XlWwE",
    "name": "Auruf",
    "email": null,
    "phone": "01990430471",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:44:02.521224",
    "updated_at": "2025-09-06 05:44:02.521224",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "yTQ8ou1hZ2AdOdUJMt4daUkZkW5VUOgV",
    "name": "Harun",
    "email": null,
    "phone": "01824439548",
    "nid": "",
    "dob": "2025-09-09",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:42:51.244618",
    "updated_at": "2025-09-06 05:42:51.244618",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "yZog0zSrmiw1IbgOf4XXUfdxuaIO0yQB",
    "name": "Ridoy",
    "email": null,
    "phone": "01835365210",
    "nid": "",
    "dob": "2025-09-09",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "driver",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 05:22:06.280119",
    "updated_at": "2025-09-06 05:22:06.280119",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null
  },
  {
    "id": "zmAidNvTNlXaAPwjmxdEoUwzKyNYNott",
    "name": "Bappy(Operation Incharge)",
    "email": null,
    "phone": "01837789171",
    "nid": "",
    "dob": "2025-09-01",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-09-06 06:25:00.22768",
    "updated_at": "2025-09-06 06:25:00.22768",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null
  },
  {
    "id": "zqxQeOjQCQEjeIPIlxI4XwWxwELWiRhA",
    "name": "Kamrul",
    "email": null,
    "phone": "01234567890",
    "nid": "",
    "dob": "2025-09-10",
    "address": null,
    "father_name": null,
    "mother_name": null,
    "blood_group": null,
    "license_number": null,
    "license_expiry_date": null,
    "emergency_contact": null,
    "marital_status": null,
    "designation": "office-staff",
    "department": null,
    "joining_date": null,
    "metadata": null,
    "image": null,
    "created_at": "2025-08-31 19:21:04.118825",
    "updated_at": "2025-08-31 19:21:04.118825",
    "deleted_at": "2025-09-06 05:03:32.958",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2"
  }
]

export const eventTypesBackup = [
  {
    "id": "VOVj5e0Qn0lRuF5JXE0QplbVFKLdSbjM",
    "name": "Depot Trip",
    "parent_id": null,
    "organization_id": "HXAVBIRDQcztDzjB99NRVjY6yz6NqAoT"
  }
]

export const eventsBackup = [
  {
    "id": "0wKPiJJfkRovVrGSn1vIQsAEGKlZDepm",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "o5f5twfcd6mXXjJT5LVWruDnvOWbga0W",
    "driver_id": "QdkFfGVxPzlxe8nywMNYTIpW8M3thkIs",
    "helper_id": null,
    "created_at": "2025-09-09 14:41:18.651576",
    "updated_at": "2025-09-09 14:41:18.651576",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "10qUOvv8UjPbBkb6CBAZyxjtDhaCg2Yx",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "RCOYMA3u5DRbs7DY1WpZJQSC0dcLq2nO",
    "helper_id": null,
    "created_at": "2025-09-09 14:24:02.55072",
    "updated_at": "2025-09-09 14:24:02.55072",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "1jWdNgPA5wTSBc6e0d6w7D8wgfsnAsK3",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "qcSB3Lk62MwoL4rh5lO7fcv2QZK4SYBd",
    "helper_id": null,
    "created_at": "2025-09-06 10:42:07.592387",
    "updated_at": "2025-09-06 10:42:07.592387",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "2CVgoNFB19U0OJYH9bQLhRf4TvqfEiSw",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-08 11:07:00.487092",
    "updated_at": "2025-09-08 11:07:00.487092",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "3UfkCpNIggkKfnO3AvtrmTADHWM5PsoM",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "nEUjeKz8BksoYwpno3rzeqFxZhYdNRGQ",
    "helper_id": null,
    "created_at": "2025-09-06 14:12:52.823478",
    "updated_at": "2025-09-06 14:12:52.823478",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "4FBVrMmbNKnDrWeAmrnj7NzkEmZxJ9A2",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "0EDVFSBMexgDmoUZl38uf6aueW2J5Ode",
    "helper_id": null,
    "created_at": "2025-09-09 14:45:55.289776",
    "updated_at": "2025-09-09 14:45:55.289776",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "4qd9FMR7Z9XDuGVIROWm7qmkzEfK04BX",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "helper_id": null,
    "created_at": "2025-09-09 13:47:32.627879",
    "updated_at": "2025-09-09 13:47:32.627879",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "4z0zTrY3mwmSeZirBVeys95oL0pZzkbm",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "0EDVFSBMexgDmoUZl38uf6aueW2J5Ode",
    "helper_id": null,
    "created_at": "2025-09-08 10:16:21.664449",
    "updated_at": "2025-09-08 10:16:21.664449",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "5Lucc3RhlJ0156V9PtJ1coB5LdNyxiCB",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "N0tccSqW8sdEEvGm2Abjsp3oZAV4AhYu",
    "helper_id": null,
    "created_at": "2025-09-09 14:47:43.226088",
    "updated_at": "2025-09-09 14:47:43.226088",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "6REk35hCxnTziWYOsGfcLArskrF9HGj4",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-09 14:12:33.165019",
    "updated_at": "2025-09-09 14:12:33.165019",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "6rzNegy5Xr5OLoWoNbrJuTFfpjBPljGW",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "RCOYMA3u5DRbs7DY1WpZJQSC0dcLq2nO",
    "helper_id": "UMd3PDf3Woh8hiVNK8qv2z8lRyaLGmNf",
    "created_at": "2025-09-08 10:37:57.363288",
    "updated_at": "2025-09-08 10:37:57.363288",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "79pRR3aUZ7EqEbVNrU7SqIGxyGhbZsgA",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "Xa9RR4pYzgkrgYGAzeHWIDzHEDlqQfP9",
    "helper_id": null,
    "created_at": "2025-09-06 10:38:16.888863",
    "updated_at": "2025-09-06 10:38:16.888863",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "8PLlZdmUfBXV9AJ1bNsJzaMzH7sRXiYO",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "Aj9saWWqah2BRAd2DzeCruLS0NWc0H1h",
    "helper_id": null,
    "created_at": "2025-09-09 14:31:05.062815",
    "updated_at": "2025-09-09 14:31:05.062815",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "8XNBFKBWSIZOyicyKouFzmIWR8Kgrj6w",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "yZog0zSrmiw1IbgOf4XXUfdxuaIO0yQB",
    "helper_id": "0AhoxNtKfTOstfsdP4NXy3NvNaqqOxOV",
    "created_at": "2025-09-09 14:38:24.929193",
    "updated_at": "2025-09-09 14:38:24.929193",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "8bofYsJRh0i5qbMKYxN5bGpOdq5F3IM0",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "PTUxnNzDV3Xcl8QKe4t5rXN2qAqoPhwi",
    "helper_id": "UMd3PDf3Woh8hiVNK8qv2z8lRyaLGmNf",
    "created_at": "2025-09-08 10:00:32.831541",
    "updated_at": "2025-09-08 10:00:32.831541",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "8paOPm0koiYbKH7eBITFKfpKJjsoxcmX",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-08 09:48:27.407886",
    "updated_at": "2025-09-08 09:48:27.407886",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "8sSVzrXSlVKByU2L3fxFoBuPNPtVgjc3",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "QdkFfGVxPzlxe8nywMNYTIpW8M3thkIs",
    "helper_id": null,
    "created_at": "2025-09-08 11:08:23.013751",
    "updated_at": "2025-09-08 11:08:23.013751",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "90yrB1wtOuiamR4f4bY9xOpcjSeafSIf",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "helper_id": null,
    "created_at": "2025-09-09 14:44:57.514095",
    "updated_at": "2025-09-09 14:44:57.514095",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "9S8LLPeVULqhdhknZSS2Of1GvMMhSwtt",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "jvhuoR4El96L2mir8RICg3ycWqRW2GpY",
    "helper_id": null,
    "created_at": "2025-09-08 11:12:52.894966",
    "updated_at": "2025-09-08 11:12:52.894966",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "B2sMkhPsfCQcyC8OujEARpalvcRoXgq1",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "Y2pURKh3HUqhKf7MXwBy1afjj7fD54zq",
    "helper_id": null,
    "created_at": "2025-09-08 10:59:43.125596",
    "updated_at": "2025-09-08 10:59:43.125596",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "CFNs6Si8WqQN43vwzxiNebHuiEg7vPQK",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "yTQ8ou1hZ2AdOdUJMt4daUkZkW5VUOgV",
    "helper_id": null,
    "created_at": "2025-09-08 10:25:32.772804",
    "updated_at": "2025-09-08 10:25:32.772804",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "CU7g3wyRX6pDtiH025kVVxcfxgDC4O6I",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "hxgNomXIT5NqZI8yvDqqwt5evDIPCaA6",
    "helper_id": null,
    "created_at": "2025-09-09 14:14:45.699739",
    "updated_at": "2025-09-09 14:14:45.699739",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "DfALuP2DdS6L3Q1F8T31ngP88utkaxt8",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "Y2pURKh3HUqhKf7MXwBy1afjj7fD54zq",
    "helper_id": null,
    "created_at": "2025-09-09 14:53:14.492001",
    "updated_at": "2025-09-09 14:53:14.492001",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "EFZEpqJll7Fp2Rh4MhHumMbfNaWFwRAW",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "uTpAVEHgWpwDFnOPHsBNB8dTNjT6kkWX",
    "helper_id": null,
    "created_at": "2025-09-08 10:36:36.723546",
    "updated_at": "2025-09-08 10:36:36.723546",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "FFFmYpCEP1HreJLNSBkrEolc0nqOuGKy",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "xL8N1uWi79QqhfclQszd92HsXtuPOwhm",
    "helper_id": null,
    "created_at": "2025-09-08 10:42:13.155439",
    "updated_at": "2025-09-08 10:42:13.155439",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "HHPIuz8pL4EZbFLC9yB3SGLYwMZsdTBi",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "N0tccSqW8sdEEvGm2Abjsp3oZAV4AhYu",
    "helper_id": null,
    "created_at": "2025-09-08 10:10:51.203892",
    "updated_at": "2025-09-08 10:10:51.203892",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 7200,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "HPf0Vt2GwLHBHQmcL8Ktqk72vg5AIg4J",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "gyk8qtQt17LMpyXxJUsgxPZ7UcJGNGdn",
    "helper_id": null,
    "created_at": "2025-09-09 14:34:02.625398",
    "updated_at": "2025-09-09 14:34:02.625398",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "HQ9Epf5X5GWhp8HkgzjTgarbTCwMF3Pn",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "v7osuBp7myXCPhcW5y7X7VpxXh9e9X5k",
    "helper_id": null,
    "created_at": "2025-09-09 13:43:18.087371",
    "updated_at": "2025-09-09 13:43:18.087371",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "HYoIv2rFWs9Grpr4XMX5wPpsAwzNZVpz",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "o5f5twfcd6mXXjJT5LVWruDnvOWbga0W",
    "driver_id": "yTQ8ou1hZ2AdOdUJMt4daUkZkW5VUOgV",
    "helper_id": null,
    "created_at": "2025-09-09 14:20:34.1231",
    "updated_at": "2025-09-09 14:20:34.1231",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "I3PYgPWxQnpcERf4fQQygmR30gc4QwML",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "RCOYMA3u5DRbs7DY1WpZJQSC0dcLq2nO",
    "helper_id": "UMd3PDf3Woh8hiVNK8qv2z8lRyaLGmNf",
    "created_at": "2025-09-06 12:25:43.402408",
    "updated_at": "2025-09-06 12:25:43.402408",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "IOJFDBqXdw9LjKTAx8Opbv5bVmIbgHzh",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "mIunKdxCwzMS5GML4RLuHkgSg7ifHokj",
    "helper_id": null,
    "created_at": "2025-09-09 14:18:35.428807",
    "updated_at": "2025-09-09 14:18:35.428807",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "JGMTIfs9617IjYiOj1Anx3Zntf9VKuJj",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "hxgNomXIT5NqZI8yvDqqwt5evDIPCaA6",
    "helper_id": null,
    "created_at": "2025-09-08 10:12:27.285915",
    "updated_at": "2025-09-08 10:12:27.285915",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "Jgr9KPZ90vNqeq3gd3GV7zGL3aKT46oq",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "yZog0zSrmiw1IbgOf4XXUfdxuaIO0yQB",
    "helper_id": "0AhoxNtKfTOstfsdP4NXy3NvNaqqOxOV",
    "created_at": "2025-09-06 10:22:57.351915",
    "updated_at": "2025-09-06 10:22:57.351915",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "LCA2LAkX69xHAMY9O7YkEEZwDUOoK3T0",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "fAGBcLhZfXdMIVOLt0r2fyYGoxomQ8rH",
    "helper_id": null,
    "created_at": "2025-09-06 12:28:02.942202",
    "updated_at": "2025-09-06 12:28:02.942202",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "MSS1NjXjzj9foOd1QygS5BwMThmGCe2g",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "helper_id": null,
    "created_at": "2025-09-08 10:01:29.180242",
    "updated_at": "2025-09-08 10:01:29.180242",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "N1Mr6Pwqz1XHyn0BrbF2WxIq2pNPrd6W",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "AAvbr5hwlUiNaPAoqyZcoo2ERvDwcPzz",
    "helper_id": null,
    "created_at": "2025-09-06 08:24:39.010761",
    "updated_at": "2025-09-06 08:24:39.010761",
    "deleted_at": "2025-09-06 08:25:29.949",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 3300,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      },
      {
        "to": "K&T",
        "cost": 3.5,
        "from": "PL",
        "fuel": 3,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "Nj2SkZI02U693gNSjcEQousUxcNx3xN7",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "4SV2QPtXI9s3Q8SEHvRWWzSqlluMhiuS",
    "helper_id": null,
    "created_at": "2025-09-06 12:35:55.183749",
    "updated_at": "2025-09-06 12:35:55.183749",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "O0Ks8GAPAhB6fwKwxpe2rsSggMFP1MIj",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "xL8N1uWi79QqhfclQszd92HsXtuPOwhm",
    "helper_id": "XayDWmlkjbCu6sTIvi79nnKpMxc2ge7u",
    "created_at": "2025-09-09 13:49:06.595588",
    "updated_at": "2025-09-09 13:49:06.595588",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "ODuoXRWUSViaS35AmGJer8FGJypojxGF",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "6ZRNf3t8b2tF4K7zMnhNOJvMGO9LnsrL",
    "helper_id": null,
    "created_at": "2025-09-08 11:04:24.792541",
    "updated_at": "2025-09-08 11:04:24.792541",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "Ojjgkje2fvt4WVorWycmINjYOPVrrVOd",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "yZog0zSrmiw1IbgOf4XXUfdxuaIO0yQB",
    "helper_id": null,
    "created_at": "2025-09-08 09:46:34.247799",
    "updated_at": "2025-09-08 09:46:34.247799",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "OsbEy6d6NTEhtOKlhrovcwewmDLUuDnh",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "yTQ8ou1hZ2AdOdUJMt4daUkZkW5VUOgV",
    "helper_id": null,
    "created_at": "2025-09-08 09:50:39.338289",
    "updated_at": "2025-09-08 09:50:39.338289",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "OvqdVedrM6ABRDSNGaf1NZ76RXfJhnRg",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "6ZRNf3t8b2tF4K7zMnhNOJvMGO9LnsrL",
    "helper_id": null,
    "created_at": "2025-09-08 10:17:59.51603",
    "updated_at": "2025-09-08 10:17:59.51603",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "PR5xiCvM7xq1C3ed2M7tbbfXGtpZGNsJ",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "helper_id": null,
    "created_at": "2025-09-08 10:33:26.168747",
    "updated_at": "2025-09-08 10:33:26.168747",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "PptCoW5J0ABdZwA6Iads0Jw6P9hNmkjI",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "helper_id": null,
    "created_at": "2025-09-08 11:14:43.061224",
    "updated_at": "2025-09-08 11:14:43.061224",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "Pvnn2ZHgZS3msIL27J8eaQ2U6FgfU4US",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "oa3Krcv1JvZ490I12AUmyXDJmkVRS71C",
    "helper_id": null,
    "created_at": "2025-09-06 12:17:52.190858",
    "updated_at": "2025-09-06 12:17:52.190858",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "R150fQ3FNKHOx8coNLmmGEtDwldiREud",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "BMtTiYnajl4a8olR8IigCqHhTwoj5rHe",
    "helper_id": "WZWabKgfYZAwn5Scfe8Is64JvXirwQGJ",
    "created_at": "2025-09-06 10:27:09.42711",
    "updated_at": "2025-09-06 10:27:09.42711",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "R7zAtZDhHSYUPrzvA8NzgQvIxCJ1h8hL",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "uTpAVEHgWpwDFnOPHsBNB8dTNjT6kkWX",
    "helper_id": null,
    "created_at": "2025-09-08 09:59:22.700449",
    "updated_at": "2025-09-08 09:59:22.700449",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "RCBBaNlEFjWB0YFP1XPgTIvIYniK4n2h",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "6ZRNf3t8b2tF4K7zMnhNOJvMGO9LnsrL",
    "helper_id": null,
    "created_at": "2025-09-09 14:52:31.963077",
    "updated_at": "2025-09-09 14:52:31.963077",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "RNmyK1qf9rDsXi9IsA5HqnxI93WAp6QU",
    "date": "2025-09-02",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "UCoW0hizmhrMf9ZF9uA1qxkkHDJcXBTi",
    "helper_id": null,
    "created_at": "2025-09-02 18:55:55.653685",
    "updated_at": "2025-09-02 18:55:55.653685",
    "deleted_at": "2025-09-07 11:52:50.585",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 3480,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      },
      {
        "to": "CCTCL",
        "cost": 5,
        "from": "PL",
        "fuel": 5,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "SwwUrSM4zY3CfHXw260urS2k9bwqkcEa",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "BMtTiYnajl4a8olR8IigCqHhTwoj5rHe",
    "helper_id": "WZWabKgfYZAwn5Scfe8Is64JvXirwQGJ",
    "created_at": "2025-09-08 10:51:44.899765",
    "updated_at": "2025-09-08 10:51:44.899765",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "U4rqpx0boIKUQF2n5fLKPUUFT1kNtWU8",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "PTUxnNzDV3Xcl8QKe4t5rXN2qAqoPhwi",
    "helper_id": null,
    "created_at": "2025-09-08 11:11:27.159736",
    "updated_at": "2025-09-08 11:11:27.159736",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "UJ4GtZojZAM8dhqIZmSYhgPAkUm5QfxV",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "85T57qr4E40OKnEECNQqupnMi2qcwVRl",
    "helper_id": null,
    "created_at": "2025-09-08 10:56:37.376432",
    "updated_at": "2025-09-08 10:56:37.376432",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "UQWz3r5VQK5TbLkhJWpdnX3qFooDp7nY",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "v5OK37Li2YY1AhCa3hDlYXeVMZogz5aZ",
    "helper_id": null,
    "created_at": "2025-09-08 10:35:30.526964",
    "updated_at": "2025-09-08 10:35:30.526964",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "UWkpqbQCBwukkI9Sx20AGOUBkw6u5vRz",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "xL8N1uWi79QqhfclQszd92HsXtuPOwhm",
    "helper_id": null,
    "created_at": "2025-09-08 09:45:08.089881",
    "updated_at": "2025-09-08 09:45:08.089881",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "UZ338n9x0DgmsJLQJEBQDeOmhjOSzq2o",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "v7osuBp7myXCPhcW5y7X7VpxXh9e9X5k",
    "helper_id": "I5uhAqU9UhLeXLWsi4lzNV0nFgcJypvf",
    "created_at": "2025-09-08 10:49:09.892938",
    "updated_at": "2025-09-08 10:49:09.892938",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "VL3gqP4Xs9yO9PLV3yRDxNZ1DYXRq5ke",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "fAGBcLhZfXdMIVOLt0r2fyYGoxomQ8rH",
    "helper_id": null,
    "created_at": "2025-09-08 10:44:57.182317",
    "updated_at": "2025-09-08 10:44:57.182317",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "VO3Uss9Xb5p7dkmV4B5sxgeqb0SDIked",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "VD18oFhJY2GG5XRwoGA45D6MF7nlvAJB",
    "helper_id": null,
    "created_at": "2025-09-08 10:43:24.501586",
    "updated_at": "2025-09-08 10:43:24.501586",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "Vws1HolmGWD9cl4YpKfkgKQ6yTZfnzSe",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "RkOG8MNBcOF26hdGmpVshhr2Rbe6I9ye",
    "helper_id": null,
    "created_at": "2025-09-06 10:21:14.815633",
    "updated_at": "2025-09-06 10:21:14.815633",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "WwlPxvJrjaL4YOvvxoaUqChe2mfwVidz",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "Aj9saWWqah2BRAd2DzeCruLS0NWc0H1h",
    "helper_id": null,
    "created_at": "2025-09-08 10:24:29.811814",
    "updated_at": "2025-09-08 10:24:29.811814",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "XO29vYFGr4LEyWu8t1FmbYTXo6AfUovX",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "0EDVFSBMexgDmoUZl38uf6aueW2J5Ode",
    "helper_id": null,
    "created_at": "2025-09-06 07:21:08.233765",
    "updated_at": "2025-09-06 07:21:08.233765",
    "deleted_at": "2025-09-06 08:25:25.656",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 3300,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      },
      {
        "to": "K&T",
        "cost": 3.5,
        "from": "PL",
        "fuel": 3,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "XkChHE6K47yPDASjjChp5qEAgx5ymYTw",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "0EDVFSBMexgDmoUZl38uf6aueW2J5Ode",
    "helper_id": null,
    "created_at": "2025-09-06 10:17:54.781415",
    "updated_at": "2025-09-06 10:17:54.781415",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "YAul1dSojO8RXFSmyFIeybrIxilRIc94",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "oa3Krcv1JvZ490I12AUmyXDJmkVRS71C",
    "helper_id": null,
    "created_at": "2025-09-09 14:32:09.292334",
    "updated_at": "2025-09-09 14:32:09.292334",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "YRCRwqCqR6EFYtxLjaGSr82Sq8othVJh",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "o5f5twfcd6mXXjJT5LVWruDnvOWbga0W",
    "driver_id": "1OarhNxXAUa87yRtpJeE5vnPq34v381a",
    "helper_id": null,
    "created_at": "2025-09-08 10:58:38.212077",
    "updated_at": "2025-09-08 10:58:38.212077",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "YjpM7ZlcEgaqAauVMI6Spbu9C9rrFkpE",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "w8RKTSup3qhho7AJzMDkqq35FJy6zd7u",
    "helper_id": null,
    "created_at": "2025-09-08 10:57:40.948118",
    "updated_at": "2025-09-08 10:57:40.948118",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "aMYB7RqgMKtbzA8gi2Hrdt9PdfCC5S9y",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "2DP98UlTnnX41UqdDZHVogFcpdB5jbQS",
    "helper_id": null,
    "created_at": "2025-09-09 14:53:59.483882",
    "updated_at": "2025-09-09 14:53:59.483882",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "aa1MHSnd5hSHWJ5HosEtoSqFnRW9gcpO",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "jvhuoR4El96L2mir8RICg3ycWqRW2GpY",
    "helper_id": null,
    "created_at": "2025-09-08 09:57:50.351779",
    "updated_at": "2025-09-08 09:57:50.351779",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 7200,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "bPg5ygefokDBQjJswrSyBDvdaEW2xK4r",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "VD18oFhJY2GG5XRwoGA45D6MF7nlvAJB",
    "helper_id": null,
    "created_at": "2025-09-09 14:29:07.668602",
    "updated_at": "2025-09-09 14:29:07.668602",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "bkEMl48HIDmxmpLhppRhuvZXZulmgLlp",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "Cqf23keKTythCwC74RkPxfSvBf50nrvL",
    "driver_id": "DZIdu4g4AGWEKV57J8TGrFBE1JulRYQh",
    "helper_id": null,
    "created_at": "2025-09-08 10:54:15.909499",
    "updated_at": "2025-09-08 10:54:15.909499",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "bqdRHyszN3dToFBn8V3DxD4JcivGs9CZ",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "Gnxyx7CNA6JZXyj3kY1futN3DmT5OMwz",
    "helper_id": null,
    "created_at": "2025-09-06 10:40:21.296019",
    "updated_at": "2025-09-06 10:40:21.296019",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "c6bwYieZvzkirgtOllJOnMZkAgKilpF1",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "OHU7XsXysen8v8grlfe7y2EeCQFW0fVn",
    "driver_id": "6ZRNf3t8b2tF4K7zMnhNOJvMGO9LnsrL",
    "helper_id": null,
    "created_at": "2025-09-06 10:39:20.183636",
    "updated_at": "2025-09-06 10:39:20.183636",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "dOz1zvu4VIMXHyFLw487pym4iJp6Lp9F",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-09 14:49:48.190293",
    "updated_at": "2025-09-09 14:49:48.190293",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "dYP7kpKz6HOM0pdLXW11AA2m5FtfFZQb",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "Y2pURKh3HUqhKf7MXwBy1afjj7fD54zq",
    "helper_id": null,
    "created_at": "2025-09-06 10:36:53.197454",
    "updated_at": "2025-09-06 10:36:53.197454",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "deBDEeflH0Z9UWr2NbsS96IfYGYBKTju",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "Wk2uXw2AJdIBuW228DwOVHMP7i0TuMMq",
    "helper_id": null,
    "created_at": "2025-09-09 14:21:59.157527",
    "updated_at": "2025-09-09 14:21:59.157527",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "ef6ZtPeSgiiQJvRX4LBTdQrnoRNnycFd",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "helper_id": "ffbRRb6BqfEtRzmkSPJEtrZVZ5qQRacb",
    "created_at": "2025-09-08 10:14:53.918673",
    "updated_at": "2025-09-08 10:14:53.918673",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 4320,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "f4fLeAgG7WMMeNeC6Bshdi2pJur7EO3V",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "8InOQATmmj7ljkiGJumTKu2HPmpJzw3J",
    "helper_id": null,
    "created_at": "2025-09-09 14:30:19.810951",
    "updated_at": "2025-09-09 14:30:19.810951",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "f9jgNKqZyFIi6P6se6SPwZSOhjhXjeI4",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "helper_id": "ffbRRb6BqfEtRzmkSPJEtrZVZ5qQRacb",
    "created_at": "2025-09-06 10:31:04.722448",
    "updated_at": "2025-09-06 10:31:04.722448",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "gQZMIwmXrMofcGh8k8zBYwYT2PLx498T",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "sgNDtVQownSMV2O9sNnNHiq5OeD2EXQd",
    "helper_id": null,
    "created_at": "2025-09-08 10:46:12.884167",
    "updated_at": "2025-09-08 10:46:12.884167",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "gYVbdOcFdZqwvZwOmRu8FesK4i7GWOJb",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "2DP98UlTnnX41UqdDZHVogFcpdB5jbQS",
    "helper_id": null,
    "created_at": "2025-09-06 10:43:49.02986",
    "updated_at": "2025-09-06 10:43:49.02986",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "hbSwapaqNZAagqR9Qx634RvfCrVvl0ha",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "85T57qr4E40OKnEECNQqupnMi2qcwVRl",
    "helper_id": null,
    "created_at": "2025-09-08 09:56:23.488305",
    "updated_at": "2025-09-08 09:56:23.488305",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 7200,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "hrZPfPAxBIbkzNxkM123lJethFMhqP3P",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "jvhuoR4El96L2mir8RICg3ycWqRW2GpY",
    "helper_id": null,
    "created_at": "2025-09-09 14:50:35.704181",
    "updated_at": "2025-09-09 14:50:35.704181",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "i4Vz0eC19qVgpsk8LcQKzmfqnbPA9yiV",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "fAGBcLhZfXdMIVOLt0r2fyYGoxomQ8rH",
    "helper_id": null,
    "created_at": "2025-09-09 14:22:54.843742",
    "updated_at": "2025-09-09 14:22:54.843742",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "iCYx6QBTQkAPN75HDhpKX1BZA7gHGaqT",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "DZIdu4g4AGWEKV57J8TGrFBE1JulRYQh",
    "helper_id": null,
    "created_at": "2025-09-09 14:36:17.633665",
    "updated_at": "2025-09-09 14:36:17.633665",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "iK8G16Mvco14h6V7EBM09oSTR7lC8OYQ",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "hxgNomXIT5NqZI8yvDqqwt5evDIPCaA6",
    "helper_id": null,
    "created_at": "2025-09-06 10:32:28.55765",
    "updated_at": "2025-09-06 10:32:28.55765",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "iRiYMwk09PJGvdt7EaHT1tjJJ86U5ORm",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "2DP98UlTnnX41UqdDZHVogFcpdB5jbQS",
    "helper_id": null,
    "created_at": "2025-09-06 06:56:20.466176",
    "updated_at": "2025-09-06 06:56:20.466176",
    "deleted_at": "2025-09-06 08:25:20.856",
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 4080,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      },
      {
        "to": "KDS",
        "cost": 10,
        "from": "PL",
        "fuel": 14,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "ilVzsPLEmbzZgGVcndc5kTOXk2IautCM",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-06 10:50:45.837518",
    "updated_at": "2025-09-06 10:50:45.837518",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "jZq2WRe6yuDI5hMuFpMDoLa1whBIYnfU",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "OJCphMNY9JyOggKSxKa2YgjKh2hJVU7L",
    "driver_id": "Wk2uXw2AJdIBuW228DwOVHMP7i0TuMMq",
    "helper_id": null,
    "created_at": "2025-09-06 12:34:02.136372",
    "updated_at": "2025-09-06 12:34:02.136372",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "jj65bGblBSm7P2Cag8bZ6vxh5LC4AMBf",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "VD18oFhJY2GG5XRwoGA45D6MF7nlvAJB",
    "helper_id": null,
    "created_at": "2025-09-08 10:09:13.529807",
    "updated_at": "2025-09-08 10:09:13.529807",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 7200,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "jkex1e5ICtmu3jGBI6tRf7pcOHsAEj5Z",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "4SV2QPtXI9s3Q8SEHvRWWzSqlluMhiuS",
    "helper_id": null,
    "created_at": "2025-09-08 10:23:42.643064",
    "updated_at": "2025-09-08 10:23:42.643064",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "kbq49sDmUPJvpAdOvVo6oBeF7a34AMkb",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "fAGBcLhZfXdMIVOLt0r2fyYGoxomQ8rH",
    "helper_id": null,
    "created_at": "2025-09-08 11:06:01.089501",
    "updated_at": "2025-09-08 11:06:01.089501",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "l6IcQaxKtVO8Vadtm9oC6nDE3FOuJi3e",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "qcSB3Lk62MwoL4rh5lO7fcv2QZK4SYBd",
    "helper_id": null,
    "created_at": "2025-09-09 14:48:59.394642",
    "updated_at": "2025-09-09 14:48:59.394642",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "l8ZGMpk4lCfb2xXLUugqfwz0xZK4AxKZ",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "w8RKTSup3qhho7AJzMDkqq35FJy6zd7u",
    "helper_id": null,
    "created_at": "2025-09-08 10:20:03.937201",
    "updated_at": "2025-09-08 10:20:03.937201",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "lGtYd6lBExXGflcdmMwG0kH2VaBBXmyT",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "N0tccSqW8sdEEvGm2Abjsp3oZAV4AhYu",
    "helper_id": null,
    "created_at": "2025-09-06 10:29:22.376783",
    "updated_at": "2025-09-06 10:29:22.376783",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "lR98tYyC023N24wThUlnqjAlic21afWx",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "helper_id": null,
    "created_at": "2025-09-08 09:43:08.064977",
    "updated_at": "2025-09-08 09:43:08.064977",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "llgxyv0fYW8ldisX4ymfXeRKWadDcEKq",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "1Oy8kuZKJ76rBOLHrUvOO9sfWwPOks42",
    "driver_id": "8InOQATmmj7ljkiGJumTKu2HPmpJzw3J",
    "helper_id": null,
    "created_at": "2025-09-06 12:19:12.778468",
    "updated_at": "2025-09-06 12:19:12.778468",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "mfaTSdPkJ6Ma9MiMqnqB0OQeCjvq0Vlk",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "sy3GM7ORvYorLMc2utxpHPmJP6vLivzx",
    "driver_id": "vopFQ2gwq7V44kMnzjkHVUy9F4vzbso9",
    "helper_id": null,
    "created_at": "2025-09-08 10:40:56.913154",
    "updated_at": "2025-09-08 10:40:56.913154",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "mhNrJQKPmzWGGrYwcuso23bKFgTmFW5c",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "AAvbr5hwlUiNaPAoqyZcoo2ERvDwcPzz",
    "helper_id": null,
    "created_at": "2025-09-06 08:26:17.01262",
    "updated_at": "2025-09-06 08:26:17.01262",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "n0vnRvqQ3cFmsCeB5nqeqrKQRbxAm0qf",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "Xa9RR4pYzgkrgYGAzeHWIDzHEDlqQfP9",
    "helper_id": null,
    "created_at": "2025-09-09 14:34:57.921331",
    "updated_at": "2025-09-09 14:34:57.921331",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "nYdhlH3Fww1ohCPDJ0qU6GifaWKtECGU",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "4SV2QPtXI9s3Q8SEHvRWWzSqlluMhiuS",
    "helper_id": null,
    "created_at": "2025-09-09 14:13:47.600258",
    "updated_at": "2025-09-09 14:13:47.600258",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "nrYRMsfibtwdjIfxWUpq6c3eAQ6p76je",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "UCoW0hizmhrMf9ZF9uA1qxkkHDJcXBTi",
    "helper_id": null,
    "created_at": "2025-09-01 21:04:23.206277",
    "updated_at": "2025-09-01 21:04:23.206277",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2448,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "102"
  },
  {
    "id": "pWXRzzYq4R7oRXl2hsiprBmv4xftORXG",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "2DP98UlTnnX41UqdDZHVogFcpdB5jbQS",
    "helper_id": null,
    "created_at": "2025-09-08 09:54:53.540909",
    "updated_at": "2025-09-08 09:54:53.540909",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 7200,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "pbJx6vBlSRBTHgFyaca6PjWiLXHzHcF7",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "0LV6ikdVEYl4sY6wP0aBtCK7ItR5Gjtx",
    "helper_id": null,
    "created_at": "2025-09-08 10:39:26.616891",
    "updated_at": "2025-09-08 10:39:26.616891",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "q5kok3FSEBP9w8MlUuYH86iRRzR2EVCY",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "Vr0vnMA6EVPh8yJTLqZsT62b38qTLsJE",
    "driver_id": "jvhuoR4El96L2mir8RICg3ycWqRW2GpY",
    "helper_id": null,
    "created_at": "2025-09-06 10:24:43.902154",
    "updated_at": "2025-09-06 10:24:43.902154",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "qR2ZiucJPoBEwklIf2CC3DTWoPtP00wQ",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "qcSB3Lk62MwoL4rh5lO7fcv2QZK4SYBd",
    "helper_id": null,
    "created_at": "2025-09-08 10:04:58.167781",
    "updated_at": "2025-09-08 10:04:58.167781",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 1440,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 0.5
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "rEmCvVhdguZ6Wy4YXYZ5r5ukjxB5vcqO",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "gyk8qtQt17LMpyXxJUsgxPZ7UcJGNGdn",
    "helper_id": null,
    "created_at": "2025-09-08 10:21:38.803113",
    "updated_at": "2025-09-08 10:21:38.803113",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "s9a1cQ91C70dXxeirSt3BdK9OUL88NIT",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "N0tccSqW8sdEEvGm2Abjsp3oZAV4AhYu",
    "helper_id": null,
    "created_at": "2025-09-08 11:09:38.421166",
    "updated_at": "2025-09-08 11:09:38.421166",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "sdCVNY7ccGpkqJthyUOibOVglKv1JXGc",
    "date": "2025-08-29",
    "type": "depot",
    "vehicle_id": "o5f5twfcd6mXXjJT5LVWruDnvOWbga0W",
    "driver_id": "8InOQATmmj7ljkiGJumTKu2HPmpJzw3J",
    "helper_id": null,
    "created_at": "2025-09-08 10:47:38.357028",
    "updated_at": "2025-09-08 10:47:38.357028",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "stmpsfkhvOWJwkMFe8N8sveg5hCpbtF5",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "UCoW0hizmhrMf9ZF9uA1qxkkHDJcXBTi",
    "helper_id": null,
    "created_at": "2025-09-01 21:05:05.919437",
    "updated_at": "2025-09-01 21:05:05.919437",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "tOIKSnJbTcYTJAvGluJxQxnOrwr0Ho11",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "yiRQnGMXIqmOiVaRxB0MgM8XGxVnCYKO",
    "driver_id": "v5OK37Li2YY1AhCa3hDlYXeVMZogz5aZ",
    "helper_id": null,
    "created_at": "2025-09-08 09:52:25.49529",
    "updated_at": "2025-09-08 09:52:25.49529",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "u6XxaqRgXNJr4d9i4I2AVLx6MeidRdSE",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "qcSB3Lk62MwoL4rh5lO7fcv2QZK4SYBd",
    "helper_id": null,
    "created_at": "2025-09-08 10:55:41.17502",
    "updated_at": "2025-09-08 10:55:41.17502",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "vQOM3etTqXvRc1Zx6l4LMCNl8VYTyHO2",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "vopFQ2gwq7V44kMnzjkHVUy9F4vzbso9",
    "helper_id": null,
    "created_at": "2025-09-09 14:46:51.28841",
    "updated_at": "2025-09-09 14:46:51.28841",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "wS70qWvF6tOIeCEYCQE7kubiIlQ5K5cD",
    "date": "2025-08-30",
    "type": "depot",
    "vehicle_id": "3reovR5HM9wWuUFkA4W23bHzTg3hpn5y",
    "driver_id": "GuVjEMweuHJOT6v6YnRlr25djGOmF03Q",
    "helper_id": "ffbRRb6BqfEtRzmkSPJEtrZVZ5qQRacb",
    "created_at": "2025-09-08 11:01:00.462116",
    "updated_at": "2025-09-08 11:01:00.462116",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "xI5bGlTC4LOF15hseHRlm7jEfOM3N6tP",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "t3qJ9R0SF30Zwfm7IzDiClizTjpi8Aqm",
    "driver_id": "uVIrWmymQJDh9m73jQMQJjmKtBXqsmIo",
    "helper_id": null,
    "created_at": "2025-09-09 14:19:35.970966",
    "updated_at": "2025-09-09 14:19:35.970966",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "xPKCwYbD9fCqGE8TWZ1glTBDKVUYgCU0",
    "date": "2025-09-01",
    "type": "depot",
    "vehicle_id": "BzdaaAdZ6pzAbRHQrbTmjOj6DAVqIfSC",
    "driver_id": "6vLgHfQF6twgfRei3rBYDZL3Y4WhkabI",
    "helper_id": "WZWabKgfYZAwn5Scfe8Is64JvXirwQGJ",
    "created_at": "2025-09-09 14:51:42.358955",
    "updated_at": "2025-09-09 14:51:42.358955",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "xfHKpcfc822sQYtlODssqCdFDnEmqKYa",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "iUMnHiDIHL93KoPDp0NsMUzWdVgrsLPX",
    "driver_id": "Aj9saWWqah2BRAd2DzeCruLS0NWc0H1h",
    "helper_id": null,
    "created_at": "2025-09-06 12:16:43.210146",
    "updated_at": "2025-09-06 12:16:43.210146",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "yjVfDwlI2g5QS4ckiE8lAMTuieNvO7Mt",
    "date": "2025-08-26",
    "type": "depot",
    "vehicle_id": "YXsBmaKvhQA4KTN9gm0ZEwU1oubInrY3",
    "driver_id": "PTUxnNzDV3Xcl8QKe4t5rXN2qAqoPhwi",
    "helper_id": "UMd3PDf3Woh8hiVNK8qv2z8lRyaLGmNf",
    "created_at": "2025-09-06 10:35:42.535328",
    "updated_at": "2025-09-06 10:35:42.535328",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "zEKuFalaZ5GUvFjIwo008FB71iyj2bep",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "afrbVl48SIbAJ7VyACunxQkTjeRZtCU3",
    "driver_id": "v7osuBp7myXCPhcW5y7X7VpxXh9e9X5k",
    "helper_id": null,
    "created_at": "2025-09-08 09:40:35.575337",
    "updated_at": "2025-09-08 09:40:35.575337",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "zPZPFbOIlRBW5jAKpxcMnw0PImQVhfOa",
    "date": "2025-08-27",
    "type": "depot",
    "vehicle_id": "OvMVCrOlnYI2W8N8kUkZBKipreV1XgNW",
    "driver_id": "VD18oFhJY2GG5XRwoGA45D6MF7nlvAJB",
    "helper_id": null,
    "created_at": "2025-09-06 12:21:01.200337",
    "updated_at": "2025-09-06 12:21:01.200337",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 5760,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 2
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "zVPZTvMhFKDHu3hJA4Bag8OTPipDUjpd",
    "date": "2025-08-31",
    "type": "depot",
    "vehicle_id": "38JGlhNUxno3JtkxnbRD10Z2qPaZgUya",
    "driver_id": "uTpAVEHgWpwDFnOPHsBNB8dTNjT6kkWX",
    "helper_id": null,
    "created_at": "2025-09-09 14:11:27.914871",
    "updated_at": "2025-09-09 14:11:27.914871",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 2880,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 1
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  },
  {
    "id": "zZHcwmOUDyCWJKDjk9R3ktGdqQiSxw8y",
    "date": "2025-08-28",
    "type": "depot",
    "vehicle_id": "YTtsWyOKC2OzoKr8dql7rOOtUx803N08",
    "driver_id": "Y2pURKh3HUqhKf7MXwBy1afjj7fD54zq",
    "helper_id": null,
    "created_at": "2025-09-08 10:06:00.440014",
    "updated_at": "2025-09-08 10:06:00.440014",
    "deleted_at": null,
    "created_by": "IRmW1HJdcpSepC3wlcLQyfl4mDtVdQb2",
    "updated_by": null,
    "deleted_by": null,
    "attachments": null,
    "expenses": [
      {
        "amount": 90,
        "description": "Toll"
      },
      {
        "amount": 710,
        "description": "Tips"
      },
      {
        "amount": 8640,
        "description": "Fuel"
      }
    ],
    "items": [
      {
        "to": "PL",
        "cost": 24,
        "from": "CPA",
        "fuel": 24,
        "count": 3
      }
    ],
    "metadata": null,
    "fuel_price": "120"
  }
]
