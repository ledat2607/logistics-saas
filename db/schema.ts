import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  password: text("password"),

  companyName: text("company_name"),
  role: text("role").default("DRIVER"),
  fleetSize: integer("fleet_size"),
});

export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "AVAILABLE",
  "IN_TRANSIT",
  "MAINTENANCE",
  "INACTIVE",
]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const vehicles = pgTable("vehicles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  licensePlate: text("license_plate").notNull().unique(),
  brand: text("brand"),
  model: text("model"),
  year: integer("year"),
  capacityKg: numeric("capacity_kg"),
  fuelType: text("fuel_type"),
  status: vehicleStatusEnum("status").default("AVAILABLE").notNull(),

  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vehicleAssignments = pgTable("vehicle_assignments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: text("driver_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  unassignedAt: timestamp("unassigned_at"), // Nối null nếu tài xế vẫn đang nhận xe
  isCurrent: boolean("is_current").default(true).notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  description: text("description").notNull(), // Nội dung bảo dưỡng/thay dầu/thay lốp...
  cost: numeric("cost"), // Chi phí bảo dưỡng
  maintenanceDate: timestamp("maintenance_date").notNull(),
  nextDueDate: timestamp("next_due_date"), // Ngày hẹn bảo dưỡng tiếp theo
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
