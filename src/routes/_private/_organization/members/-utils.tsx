import { createData, getDatas } from "@/lib/db/functions"
import { AnyType } from "@/lib/types"
import { createServerFn } from "@tanstack/react-start"
import { generateId } from "better-auth"

export const createMember = createServerFn({ method: "POST" })
  .validator((data: {
    values: AnyType
  }) => data)
  .handler(async ({ data }): Promise<AnyType> => {
    const { values } = data

    let user: AnyType = null;
    
    const exists = await getDatas({
      data: {
        table: "users",
        where: {
          email: values.email
        }
      }
    })

    if (exists?.result?.length) {
      user = exists.result[0]
    }else{
      const newUser = await createData({
        data: {
          table: "users",
          values: {
            id: generateId(),
            name: values.name,
            email: values.email,
            role: "user",
            emailVerified: true
          }
        }
      })

      user = newUser
    }

    const member = await createData({
      data: {
        table: "members",
        values: {
          id: generateId(),
          user_id: user.id,
          role: values.role,
        }
      }
    })

    return {
        ...member,
        message: `Member Created Successfully`
      }
  })