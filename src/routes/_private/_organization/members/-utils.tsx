import { createData, getDatas } from "@/lib/db/functions"
import { AnyType } from "@/lib/types"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"
import { auth } from "@/lib/auth/config"

export const createMember = createServerFn({ method: "POST" })
  .validator((data: {
    values: AnyType
  }) => data)
  .handler(async ({ data }): Promise<AnyType> => {
    const { values } = data

    let userId = "";

    const exists = await getDatas({
      data: {
        table: "users",
        where: {
          email: values.email
        }
      }
    })

    if (exists?.result?.length) {
      userId = exists.result[0]?.id
    } else {
      userId = generateId()
      
      const ctx = await auth.$context
      const hashedPassword = await ctx.password.hash("12345678")

      await createData({
        data: {
          table: "users",
          values: {
            id: userId,
            name: values.name,
            email: values.email,
            role: "user",
            emailVerified: true
          }
        }
      })

      await createData({
        data: {
          table: "accounts",
          values: {
            id: generateId(),
            accountId: userId,
            providerId: "credential",
            userId: userId,
            password: hashedPassword,
          }
        }
      })
    }

    const existingMember = await getDatas({
      data: {
        table: "members",
        where: {
          userId
        }
      }
    })

    if (existingMember?.result?.length) {
      throw new Error("User is already a member of this organization")
    }

    await createData({
      data: {
        table: "members",
        values: {
          id: generateId(),
          userId: userId,
          role: values.role,
        }
      }
    })

    return {
      message: `Member Created Successfully`
    }
  })