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
  image?: string | null;
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
  maintenance?: MaintenanceLog | null;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  vehicleLicensePlate?: string | null;
  description: string;
  cost: number | string | null; 
  garageLocation?: string | null;
  maintenanceDate: Date;
  nextDueDate?: Date | null;
  createdAt: Date;
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  vehicleLicensePlate?: string | null;
  description: string;
  cost?: number;
  garageLocation?: string | null;
  maintenanceDate?: Date | string;
  nextDueDate?: Date | string | null;
}