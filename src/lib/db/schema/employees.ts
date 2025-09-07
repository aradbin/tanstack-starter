import { pgTable } from "drizzle-orm/pg-core"
import * as table from "drizzle-orm/pg-core"

import { timestamps } from "./columns.helpers"
import { organizations } from "./users"

export const employees = pgTable("employees", {
  id: table.text().primaryKey(),
  name: table.text().notNull(),
  email: table.text(),
  phone: table.text(),
  nid: table.text(),
  dob: table.date(),
  address: table.text(),
  fatherName: table.text("father_name"),
  motherName: table.text("mother_name"),
  bloodGroup: table.text("blood_group"),
  licenseNumber: table.text("license_number"),
  licenseExpiryDate: table.date("license_expiry_date"),
  emergencyContact: table.text("emergency_contact"),
  maritalStatus: table.text("marital_status"),
  designation: table.text(), // driver, helper
  department: table.text(),
  joiningDate: table.date("joining_date"),
  image: table.text(),
  metadata: table.jsonb(),
  organizationId: table
    .text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  ...timestamps,
})
