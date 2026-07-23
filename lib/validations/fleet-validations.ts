import { z } from "zod";

// 1. Zod Enum khớp 1:1 với VehicleStatus
export const vehicleStatusSchema = z.enum([
  "AVAILABLE",
  "IN_TRANSIT",
  "MAINTENANCE",
  "INACTIVE",
]);

export const vehiclefuelSchema = z.enum(["DIESEL", "ELECTRIC", "PETROL"]);

// 2. Schema validate Form Thêm/Sửa Xe
export const createVehicleSchema = z.object({
  licensePlate: z
    .string()
    .min(1, "Vui lòng nhập biển số xe")
    .regex(
      /^[0-9]{2}[A-Z]-[0-9]{3}\.[0-9]{2}$|^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
      "Biển số xe không đúng định dạng (VD: 29H-123.45 hoặc 51D-98765)",
    ),
  brand: z.string().min(1, "Vui lòng chọn hoặc nhập hãng xe"),
  model: z.string().min(1, "Vui lòng nhập dòng/mẫu xe"),
  year: z.coerce
    .number({ message: "Năm sản xuất phải là số" })
    .min(1990, "Năm sản xuất không hợp lệ")
    .max(new Date().getFullYear(), "Năm sản xuất không được vượt quá hiện tại"),
    
  capacityKg: z.coerce
    .number()
    .positive("Tải trọng phải lớn hơn 0")
    .optional()
    .transform((val) =>
      val !== undefined && val !== null ? String(val) : null,
    ),
  fuelType: vehiclefuelSchema.default("DIESEL"),
  status: vehicleStatusSchema.default("AVAILABLE"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
