import z from "zod";

export const tripFormSchema = z.object({
  tripCode: z.string().optional(),
  vehicleId: z.string().min(1, "Vui lòng chọn xe"),
  driverId: z.string().optional(),
  startLocation: z.string().min(1, "Vui lòng nhập điểm xuất phát"),
  endLocation: z.string().min(1, "Vui lòng nhập điểm đến"),
  estimatedStartTime: z.string().min(1, "Vui lòng chọn thời gian bắt đầu dự kiến"),
  estimatedEndTime: z.string().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PLANNED"),
  notes: z.string().optional(),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;

