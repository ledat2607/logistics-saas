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
    vehicleLicensePlate: z
      .string()
      .min(1, "Vui lòng nhập biển số xe")
      .nullable()
      .optional(),

    description: z.string().min(1, "Vui lòng nhập mô tả bảo dưỡng"),

    cost: z.coerce
      .number({ message: "Chi phí phải là một số" })
      .nonnegative("Chi phí không được là số âm")
      .optional(),

    garageLocation: z.string().optional().nullable(),

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

export const maintenanceStatusEnum = z.enum([
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
]);

export const updateMaintenanceSchema = z
  .object({
    status: maintenanceStatusEnum.optional(),
    vehicleId: z.string().optional(),
    description: z.string().optional(),
    garageLocation: z.string().nullable().optional(),

    // Chấp nhận cost dạng number, string (như "2.200.000") hoặc null
    cost: z.any().optional(),

    // Chấp nhận cả maintenanceDate lẫn startDate từ Form
    maintenanceDate: z.coerce.date().optional(),
    startDate: z.coerce.date().optional(),

    // Chấp nhận cả nextDueDate lẫn endDate từ Form
    nextDueDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),

    // Đọc thêm object details lồng nhau nếu Client gửi dạng formData.details
    details: z
      .object({
        description: z.string().optional(),
        cost: z.any().optional(),
        garageLocation: z.string().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().nullable().optional(),
      })
      .optional(),
  })
  .transform((data) => {
    const description = data.description ?? data.details?.description;

    const garageLocation = data.garageLocation ?? data.details?.garageLocation;

    const rawMaintenanceDate =
      data.maintenanceDate ?? data.startDate ?? data.details?.startDate;
    const maintenanceDate = rawMaintenanceDate
      ? new Date(rawMaintenanceDate)
      : undefined;

    const rawNextDueDate =
      data.nextDueDate ?? data.endDate ?? data.details?.endDate;
    const nextDueDate =
      rawNextDueDate !== undefined
        ? rawNextDueDate
          ? new Date(rawNextDueDate)
          : null
        : undefined;

    let rawCost = data.cost ?? data.details?.cost;
    let cost: string | null | undefined = undefined;

    if (rawCost !== undefined && rawCost !== null && rawCost !== "") {
      if (typeof rawCost === "string") {
        const cleaned = rawCost.replace(/\D/g, "");
        cost = cleaned ? cleaned : null;
      } else if (typeof rawCost === "number") {
        cost = String(rawCost);
      }
    } else if (rawCost === null || rawCost === "") {
      cost = null;
    }

    return {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
      ...(description !== undefined && { description }),
      ...(garageLocation !== undefined && { garageLocation }),
      ...(maintenanceDate !== undefined && { maintenanceDate }),
      ...(nextDueDate !== undefined && { nextDueDate }),
      ...(cost !== undefined && { cost }),
    };
  });
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
