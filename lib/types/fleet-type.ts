export type VehicleStatus =
  | "AVAILABLE"
  | "IN_TRANSIT"
  | "MAINTENANCE"
  | "INACTIVE"
  | "IN_USE";

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

// Enum định nghĩa các trạng thái Trip (khớp với tripStatusEnum trong DB)
export type TripStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// 2. Interface cho Trip (Chuyến đi)
export interface TripSChedules {
  id: string;
  tripCode: string | null;
  vehicleId: string;
  driverId: string | null;
  startLocation: string;
  endLocation: string;
  estimatedStartTime: Date | string;
  estimatedEndTime: Date | string | null;
  actualStartTime: Date | string | null;
  actualEndTime: Date | string | null;
  distanceKm: number | null;
  fuelConsumedLiters: number | null;
  tollCost: number | null;
  status: TripStatus;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TripLocation {
  id: string;
  tripId: string;
  latitude: number;
  longitude: number;
  address: string | null;
  speedKmh: number | null;
  recordedAt: Date | string;
}
