import { authOrgMiddleware } from "@/lib/auth/middleware"
import { db } from "@/lib/db"
import { customerContacts, customers } from "@/lib/db/schema"
import { AnyType, OptionType } from "@/lib/types"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { and, eq, inArray } from "drizzle-orm"

export const businessTypes = ['Limited', 'Partnership', 'LLC', 'Corporation', 'Individual']
export const businessTypeOptions: OptionType[] = [
  { name: "Limited", id: "Limited" },
  { name: "Partnership", id: "Partnership" },
  { name: "LLC", id: "LLC" },
  { name: "Corporation", id: "Corporation" },
  { name: "Individual", id: "Individual" },
]

export const createCustomer = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType
  }) => data)
  .handler(async ({ context, data }) => {
    const { values } = data

    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.insert(customers).values({
          id: generateId(),
          ...values,
          organizationId: context?.session?.activeOrganizationId,
          createdBy: context?.user?.id,
        }).returning()

        if(values?.contacts && values?.contacts.length > 0) {
          const newCustomerContacts: AnyType[] = []
          values?.contacts.forEach((contact: AnyType) => {
            if(contact?.id){
              newCustomerContacts.push({
                id: generateId(),
                email: contact.email,
                phone: contact.phone,
                designation: contact.designation,
                customerId: result?.id,
                contactId: contact?.id,
                createdBy: context?.user?.id
              })
            }
          })
          await tx.insert(customerContacts).values(newCustomerContacts)
        }

        return {
          ...result,
          message: "Customer Created Successfully"
        }
      })
    } catch(error) {
      console.error(error)
      throw new Error("Something went wrong. Please try again")
    }
  })

export const updateCustomer = createServerFn({ method: "POST" })
  .middleware([authOrgMiddleware])
  .validator((data: {
    values: AnyType,
    id: AnyType
  }) => data)
  .handler(async ({ context, data }) => {
    const { values, id } = data
    try {
      return await db.transaction(async (tx) => {
        const [result] = await tx.update(customers).set({
          ...values,
          updatedBy: context?.user?.id,
        }).where(eq(customers.id, id)).returning()

        const existing = await tx.query.customerContacts.findMany({
          where: eq(customerContacts.customerId, id)
        })
        const incomingIds = values?.contacts?.map((c: AnyType) => c.id)?.filter(Boolean)

        const toDelete = existing.filter(c => !incomingIds.includes(c.contactId))
        if (toDelete.length > 0) {
          await tx.delete(customerContacts).where(
            and(inArray(customerContacts.id, toDelete.map(c => c.id)))
          )
        }

        for (const contact of values?.contacts || []) {
          const existingContact = existing.find(c => c.contactId === contact.id)

          if (existingContact) {
            await tx.update(customerContacts)
              .set({
                email: contact.email,
                phone: contact.phone,
                designation: contact.designation,
                updatedBy: context?.user?.id
              })
              .where(eq(customerContacts.id, existingContact.id))
          } else {
            await tx.insert(customerContacts).values({
              id: generateId(),
              email: contact.email,
              phone: contact.phone,
              designation: contact.designation,
              customerId: id,
              contactId: contact.id,
              createdBy: context?.user?.id
            })
          }
        }

        return {
          ...result,
          message: "Customer Updated Successfully"
        }
      })
    } catch {
      throw new Error("Something went wrong. Please try again")
    }
  })
