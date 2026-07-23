export type VehicleStatus =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "MAINTENANCE"
  | "INACTIVE";

export type VehiclefuelSchema = "DIESEL" | "ELECTRIC" | "PETROL";

export interface VehicleSchema {
  id: string;
  licensePlate: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  capacityKg: number | null;
  fuelType: VehiclefuelSchema;
  status: VehicleStatus;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FleetVehicle extends VehicleSchema {
  driver?: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
  } | null;
  currentLocation?: string;
  lastMaintenanceDate?: string;
}

