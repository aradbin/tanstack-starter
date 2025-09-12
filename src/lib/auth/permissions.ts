import { defaultStatements } from "better-auth/plugins/organization/access";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  ...defaultStatements,
  task: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);