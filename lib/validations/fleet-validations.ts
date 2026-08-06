import { z } from "zod";

// 1. Zod Enum khớp 1:1 với VehicleStatus
export const vehicleStatusSchema = z.enum([
  "AVAILABLE",
  "IN_TRANSIT",
  "MAINTENANCE",
  "INACTIVE",
]);

export const vehiclefuelSchema = z.enum(["DIESEL", "ELECTRIC", "PETROL"]);

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
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  fuelType: vehiclefuelSchema.default("DIESEL"),
  status: vehicleStatusSchema.default("AVAILABLE"),
});
export const maintenanceSchema = z
  .object({
    vehicleId: z.string().min(1, "Vui lòng chọn xe"),
    vehicleLicensePlate: z.string().min(1, "Vui lòng nhập biển số xe"),

    // Khi tạo mới nếu để trống sẽ fallback hoặc cho phép chuỗi rỗng/optional
    description: z.string().min(1, "Vui lòng nhập mô tả bảo dưỡng"),

    cost: z.coerce
      .number({ message: "Chi phí phải là một số" })
      .nonnegative("Chi phí không được là số âm")
      .optional()
      .nullable(),

    // Tự động nhận ngày hiện tại nếu người dùng không truyền/không chọn
    maintenanceDate: z.coerce
      .date()
      .refine((d) => d instanceof Date && !isNaN(d.getTime()), {
        message: "Ngày bảo dưỡng không hợp lệ",
      })
      .default(() => new Date()),

    nextDueDate: z.coerce
      .date({ message: "Ngày hẹn không hợp lệ" })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.maintenanceDate && data.nextDueDate) {
        return data.nextDueDate >= data.maintenanceDate;
      }
      return true;
    },
    {
      message: "Ngày hẹn tiếp theo phải sau hoặc bằng ngày bảo dưỡng",
      path: ["nextDueDate"],
    },
  );

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
