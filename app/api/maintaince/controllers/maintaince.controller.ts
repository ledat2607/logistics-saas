import { db } from "@/db";
import { maintenanceLogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { maintenanceSchema } from "@/lib/validations/fleet-validations";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const maintenanceController = {
  /* Create new maintenance record */
  createMaintenanceRecord: async (request: Request) => {
    try {
      const session = await auth.api.getSession({ headers: await headers() });

      if (!session || !session.user) {
        return NextResponse.json(
          {
            error:
              "Bạn chưa đăng nhập hoặc không có quyền thực hiện hành động này",
          },
          { status: 401 },
        );
      }

      const body = await request.json();
      const validationResult = await maintenanceSchema.safeParseAsync(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() },
          { status: 400 },
        );
      }

      const validatedData = validationResult.data;

      const [newMaintenanceRecord] = await db
        .insert(maintenanceLogs)
        .values({
          vehicleId: validatedData.vehicleId,
          description: validatedData.description,

          cost:
            validatedData.cost !== undefined
              ? String(validatedData.cost)
              : null,
          garageLocation: validatedData.garageLocation ?? null,
          maintenanceDate: validatedData.maintenanceDate,
          nextDueDate: validatedData.nextDueDate ?? null,
        })
        .returning();

      return NextResponse.json(
        {
          message: "Thêm bản ghi bảo dưỡng mới thành công!",
          data: newMaintenanceRecord,
        },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Tạo bản ghi bảo dưỡng thất bại" },
        { status: 500 },
      );
    }
  },
};
