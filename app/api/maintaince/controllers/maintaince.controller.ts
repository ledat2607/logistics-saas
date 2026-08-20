import { db } from "@/db";
import { maintenanceLogs, vehicleAssignments, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  maintenanceSchema,
  updateMaintenanceSchema,
} from "@/lib/validations/fleet-validations";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

  /**delete maintaince */
  deleteMaintainceRecord: async (
    request: NextRequest,
    { params }: { params?: Promise<{ id: string }> } = {},
  ) => {
    try {
      // 1. Kiểm tra Authentication
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session?.user) {
        return NextResponse.json(
          { error: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn." },
          { status: 401 },
        );
      }

      // 2. Kiểm tra Role người dùng
      const userRole = (session.user as any).role;
      if (userRole === "DRIVER") {
        return NextResponse.json(
          { error: "Tài xế không có quyền xóa bản ghi bảo trì!" },
          { status: 403 },
        );
      }

      let maintainceId: string | null = null;

      if (params) {
        const resolvedParams = await params;
        maintainceId = resolvedParams?.id || null;
      }

      if (!maintainceId) {
        const { searchParams } = new URL(request.url);
        maintainceId = searchParams.get("id");
      }

      if (!maintainceId) {
        try {
          const body = await request.json();
          maintainceId = body.id || body.maintainceId;
        } catch {}
      }

      if (!maintainceId) {
        return NextResponse.json(
          { error: "Thiếu ID bản ghi cần xóa!" },
          { status: 400 },
        );
      }

      const [existingLog] = await db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.id, maintainceId));

      if (!existingLog) {
        return NextResponse.json(
          { error: "Không tìm thấy bản ghi bảo trì cần xóa." },
          { status: 404 },
        );
      }

      const [vehicle] = await db
        .select()
        .from(vehicles)
        .where(
          and(
            eq(vehicles.id, existingLog.vehicleId),
            eq(vehicles.ownerId, session.user.id),
          ),
        );

      if (!vehicle) {
        return NextResponse.json(
          { error: "Bạn không có quyền thao tác trên phương tiện này." },
          { status: 403 },
        );
      }

      const [deletedLog] = await db
        .delete(maintenanceLogs)
        .where(eq(maintenanceLogs.id, maintainceId))
        .returning();

      const activeMaintenance = await db
        .select()
        .from(maintenanceLogs)
        .where(
          and(
            eq(maintenanceLogs.vehicleId, existingLog.vehicleId),
            eq(maintenanceLogs.status, "IN_PROGRESS"),
          ),
        );

      let updatedVehicle = vehicle;

      if (activeMaintenance.length === 0) {
        const [activeAssignment] = await db
          .select()
          .from(vehicleAssignments)
          .where(
            and(
              eq(vehicleAssignments.vehicleId, existingLog.vehicleId),
              eq(vehicleAssignments.isCurrent, true),
            ),
          );

        const nextStatus = activeAssignment ? "IN_USE" : "AVAILABLE";

        const [v] = await db
          .update(vehicles)
          .set({
            status: nextStatus,
            updatedAt: new Date(),
          })
          .where(eq(vehicles.id, existingLog.vehicleId))
          .returning();

        updatedVehicle = v;
      }

      return NextResponse.json(
        {
          message: "Xóa bản ghi bảo trì thành công!",
          data: {
            deletedLog,
            updatedVehicle,
          },
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Delete Maintenance Error:", error);
      return NextResponse.json(
        { error: error.message || "Xóa bản ghi bảo dưỡng thất bại." },
        { status: 500 },
      );
    }
  },

  updateMaintenanceRecord: async (
    request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id: maintenanceId } = await params;
      const body = await request.json();

      const targetId = maintenanceId || body.id || body.originalId;

      if (!targetId) {
        return NextResponse.json(
          { error: "Thiếu ID bản ghi bảo dưỡng" },
          { status: 400 },
        );
      }

      const validationResult =
        await updateMaintenanceSchema.safeParseAsync(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.flatten() },
          { status: 400 },
        );
      }

      const updateData = validationResult.data;

      const [log] = await db
        .update(maintenanceLogs)
        .set(updateData)
        .where(eq(maintenanceLogs.id, targetId))
        .returning();

      if (!log) {
        return NextResponse.json(
          { error: "Không tìm thấy bản ghi bảo dưỡng" },
          { status: 404 },
        );
      }

      let updatedVehicle = null;
      const vehicleId = log.vehicleId;

      // 2. Nếu trạng thái bảo dưỡng mới là IN_PROGRESS -> Đổi trạng thái xe thành MAINTENANCE
      if (log.status === "IN_PROGRESS") {
        const [v] = await db
          .update(vehicles)
          .set({
            status: "MAINTENANCE",
            updatedAt: new Date(),
          })
          .where(eq(vehicles.id, vehicleId))
          .returning();

        updatedVehicle = v;
      } else {
        // 3. Nếu trạng thái là COMPLETED hoặc CANCELED -> Kiểm tra xem còn lịch bảo dưỡng khác đang IN_PROGRESS không
        const activeMaintenance = await db
          .select()
          .from(maintenanceLogs)
          .where(
            and(
              eq(maintenanceLogs.vehicleId, vehicleId),
              eq(maintenanceLogs.status, "IN_PROGRESS"),
            ),
          );

        // 4. Nếu KHÔNG còn lịch bảo dưỡng nào khác đang chạy -> Cập nhật lại status xe
        if (activeMaintenance.length === 0) {
          const [activeAssignment] = await db
            .select()
            .from(vehicleAssignments)
            .where(
              and(
                eq(vehicleAssignments.vehicleId, vehicleId),
                eq(vehicleAssignments.isCurrent, true),
              ),
            );

          const nextStatus = activeAssignment ? "IN_USE" : "AVAILABLE";

          const [v] = await db
            .update(vehicles)
            .set({
              status: nextStatus,
              updatedAt: new Date(),
            })
            .where(eq(vehicles.id, vehicleId))
            .returning();

          updatedVehicle = v;
        }
      }

      return NextResponse.json(
        {
          message: "Cập nhật bản ghi bảo trì thành công!",
          data: {
            updatedRecord: log,
            updatedVehicle,
          },
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Lỗi update maintenance:", error);
      return NextResponse.json(
        { error: error.message || "Cập nhật bản ghi bảo dưỡng thất bại" },
        { status: 500 },
      );
    }
  },
};
