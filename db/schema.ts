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
  "IN_USE",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);

export const tripStatusEnum = pgEnum("trip_status", [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "DELAYED",
]);
export const maintainceEnum = pgEnum("maintaince_status", [
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
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
  image: text("image").default(
    `https://netrinoimages.s3.eu-west-2.amazonaws.com/2024/03/01/1692051/648591/rezoro3d_vanto_truck_short_refrigerated_3d_model_c4d_max_obj_fbx_ma_lwo_3ds_3dm_stl_6751154_m.webp`,
  ),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  driverId: text("driver_id").references(() => user.id, {
    onDelete: "set null",
  }),

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
  unassignedAt: timestamp("unassigned_at"),
  isCurrent: boolean("is_current").default(true).notNull(),
  status: assignmentStatusEnum("status").default("PENDING").notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  cost: numeric("cost"),
  status: maintainceEnum("status").default("IN_PROGRESS"),
  garageLocation: text("garage_location"),
  maintenanceDate: timestamp("maintenance_date").notNull(),
  nextDueDate: timestamp("next_due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trips = pgTable("trips", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  tripCode: text("trip_code").unique(),

  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  driverId: text("driver_id").references(() => user.id, {
    onDelete: "set null",
  }),

  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),

  estimatedStartTime: timestamp("estimated_start_time").notNull(),
  estimatedEndTime: timestamp("estimated_end_time"),

  actualStartTime: timestamp("actual_start_time"),
  actualEndTime: timestamp("actual_end_time"),

  distanceKm: numeric("distance_km"),
  fuelConsumedLiters: numeric("fuel_consumed_liters"),
  tollCost: numeric("toll_cost"),

  status: tripStatusEnum("status").default("PLANNED").notNull(),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tripLocations = pgTable("trip_locations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  tripId: text("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),

  latitude: numeric("latitude").notNull(),
  longitude: numeric("longitude").notNull(),

  address: text("address"),
  speedKmh: numeric("speed_kmh"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});
