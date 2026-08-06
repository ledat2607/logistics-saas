import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, vehicleAssignments, vehicles } from "@/db/schema";
import { createVehicleSchema } from "@/lib/validations/fleet-validations";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { aliasedTable, and, desc, eq } from "drizzle-orm";
import { deleteImageFromFirebaseServer } from "@/lib/firebase-server";

export const fleetController = {
  /**
   * Create a new vehicle
   */
  create: async (request: NextRequest) => {
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

      const userRole = (session.user as any).role;
      if (userRole === "DRIVER") {
        return NextResponse.json(
          { error: "Tài xế không có quyền thêm mới phương tiện!" },
          { status: 403 },
        );
      }

      const ownerId = session.user.id;

      const body = await request.json();

      const validationResult = createVehicleSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: "Dữ liệu không hợp lệ",
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 422 },
        );
      }

      const validatedData = validationResult.data;

      const [newVehicle] = await db
        .insert(vehicles)
        .values({
          licensePlate: validatedData.licensePlate,
          brand: validatedData.brand ?? null,
          model: validatedData.model ?? null,
          year: validatedData.year ? Number(validatedData.year) : null,

          capacityKg: validatedData.capacityKg
            ? String(validatedData.capacityKg)
            : null,

          fuelType: validatedData.fuelType ?? null,
          status: validatedData.status,
          ownerId: ownerId,
        })
        .returning();

      return NextResponse.json(
        {
          message: "Thêm phương tiện mới thành công!",
          data: newVehicle,
        },
        { status: 201 },
      );
    } catch (error: any) {
      console.error("Lỗi khi thêm phương tiện:", error);

      const cause = error?.cause || error;

      const isDuplicatePlate =
        cause?.code === "23505" ||
        error?.code === "23505" ||
        String(error?.message).includes("23505") ||
        String(cause?.message).includes("23505") ||
        String(error?.message).includes("duplicate key") ||
        String(cause?.message).includes("duplicate key") ||
        String(error?.message).includes("vehicles_license_plate_unique") ||
        String(cause?.message).includes("vehicles_license_plate_unique");

      if (isDuplicatePlate) {
        return NextResponse.json(
          { error: "Biển số xe này đã tồn tại trong hệ thống!" },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Thêm mới phương tiện thất bại. Vui lòng thử lại!" },
        { status: 500 },
      );
    }
  },

  getAllFleet: async () => {
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

      const driverUser = aliasedTable(user, "driverUser");

      const fleetList = await db
        .select({
          vehicle: vehicles,
          owner: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },

          driver: {
            id: driverUser.id,
            name: driverUser.name,
            email: driverUser.email,
            image: driverUser.image,
          },
          assignment: {
            id: vehicleAssignments.id,
            status: vehicleAssignments.status,
            assignedAt: vehicleAssignments.assignedAt,
            unassignedAt: vehicleAssignments.unassignedAt,
            isCurrent: vehicleAssignments.isCurrent,
          },
        })
        .from(vehicles)
        .leftJoin(user, eq(vehicles.ownerId, user.id))
        .leftJoin(driverUser, eq(vehicles.driverId, driverUser.id))
        .leftJoin(
          vehicleAssignments,
          and(
            eq(vehicleAssignments.vehicleId, vehicles.id),
            eq(vehicleAssignments.isCurrent, true),
          ),
        )
        .where(eq(vehicles.ownerId, session.user.id))
        .orderBy(desc(vehicles.createdAt));

      return NextResponse.json({
        data: fleetList,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Lấy danh sách xe thất bại" },
        { status: 500 },
      );
    }
  },

  deleteFleet: async (
    request: NextRequest,
    { params }: { params?: Promise<{ id: string }> } = {},
  ) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session || !session.user) {
        return NextResponse.json(
          {
            error:
              "Bạn chưa đăng nhập hoặc không có quyền thực hiện hành động này",
          },
          { status: 401 },
        );
      }

      const userRole = (session.user as any).role;
      if (userRole === "DRIVER") {
        return NextResponse.json(
          { error: "Tài xế không có quyền xóa phương tiện!" },
          { status: 403 },
        );
      }

      let vehicleId: string | null = null;

      if (params) {
        const resolvedParams = await params;
        vehicleId = resolvedParams?.id || null;
      }

      if (!vehicleId) {
        const { searchParams } = new URL(request.url);
        vehicleId = searchParams.get("id");
      }

      if (!vehicleId) {
        try {
          const body = await request.json();
          vehicleId = body.id || body.vehicleId;
        } catch {}
      }

      if (!vehicleId) {
        return NextResponse.json(
          { error: "Thiếu ID phương tiện cần xóa!" },
          { status: 400 },
        );
      }

      await db
        .delete(vehicleAssignments)
        .where(eq(vehicleAssignments.vehicleId, vehicleId));

      const [deletedVehicle] = await db
        .delete(vehicles)
        .where(
          and(
            eq(vehicles.id, vehicleId),
            eq(vehicles.ownerId, session.user.id),
          ),
        )
        .returning();

      if (!deletedVehicle) {
        return NextResponse.json(
          {
            error:
              "Không tìm thấy phương tiện hoặc bạn không có quyền xóa phương tiện này!",
          },
          { status: 404 },
        );
      }

      if (deletedVehicle.image) {
        await deleteImageFromFirebaseServer(deletedVehicle.image);
      }

      return NextResponse.json(
        {
          message: "Xóa phương tiện thành công!",
          data: deletedVehicle,
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Lỗi khi xóa phương tiện:", error);
      return NextResponse.json(
        {
          error: error.message || "Xóa phương tiện thất bại. Vui lòng thử lại!",
        },
        { status: 500 },
      );
    }
  },

  /**Update fleet */
  updateFleet: async (
    request: NextRequest,
    { params }: { params?: Promise<{ id: string }> },
  ) => {
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

      // 2. Kiểm tra Role (DRIVER không được sửa)
      const userRole = (session.user as any).role;
      if (userRole === "DRIVER") {
        return NextResponse.json(
          { error: "Tài xế không có quyền cập nhật phương tiện!" },
          { status: 403 },
        );
      }

      const resolvedParams = await params;
      const fleetId = resolvedParams?.id;

      if (!fleetId) {
        return NextResponse.json(
          { error: "Thiếu ID phương tiện cần cập nhật" },
          { status: 400 },
        );
      }

      const body = await request.json();

      const {
        brand,
        licensePlate,
        model,
        year,
        capacityKg,
        fuelType,
        status,
        image,
      } = body;

      // 5. Cập nhật vào Database (Ví dụ dùng Prisma)
      const [updatedFleet] = await db
        .update(vehicles)
        .set({
          brand,
          licensePlate,
          model,
          year: year ? Number(year) : undefined,
          capacityKg: capacityKg ? String(capacityKg) : undefined,
          fuelType,
          status,
          image,
          updatedAt: new Date(),
        })
        .where(eq(vehicles.id, fleetId))
        .returning();
      return NextResponse.json(
        {
          message: "Cập nhật thông tin phương tiện thành công",
          updatedFleet,
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Lỗi khi cập nhật phương tiện:", error);

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Không tìm thấy phương tiện với ID này" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { error: "Cập nhật phương tiện thất bại" },
        { status: 500 },
      );
    }
  },

  /*
  Get Driver for manager */
  getDrivers: async (request: NextRequest) => {
    try {
      const session = await auth.api.getSession({ headers: await headers() });

      if (!session || !session.user) {
        return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
      }

      const driversList = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        })
        .from(user)
        .where(eq(user.role, "DRIVER"));

      return NextResponse.json({ data: driversList });
    } catch (error: any) {
      return NextResponse.json(
        { error: "Lỗi lấy danh sách tài xế" },
        { status: 500 },
      );
    }
  },

  /**
   * Assign or Unassign Driver to a Vehicle
   */
  assignDriver: async (request: NextRequest) => {
    try {
      const session = await auth.api.getSession({ headers: await headers() });

      if (!session || !session.user) {
        return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
      }

      const userRole = (session.user as any).role;
      if (userRole === "DRIVER") {
        return NextResponse.json(
          { error: "Bạn không có quyền thực hiện thao tác này!" },
          { status: 403 },
        );
      }

      const body = await request.json();
      const { vehicleId, driverId } = body;

      if (!vehicleId) {
        return NextResponse.json(
          { error: "Thiếu ID phương tiện" },
          { status: 400 },
        );
      }

      const [updatedVehicle] = await db
        .update(vehicles)
        .set({
          driverId: driverId || null,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(vehicles.id, vehicleId),
            eq(vehicles.ownerId, session.user.id),
          ),
        )
        .returning();

      if (!updatedVehicle) {
        return NextResponse.json(
          {
            error:
              "Không tìm thấy phương tiện hoặc bạn không có quyền cập nhật!",
          },
          { status: 404 },
        );
      }

      await db
        .update(vehicleAssignments)
        .set({
          isCurrent: false,
          unassignedAt: new Date(),
          status: "COMPLETED",
        })
        .where(
          and(
            eq(vehicleAssignments.vehicleId, vehicleId),
            eq(vehicleAssignments.isCurrent, true),
          ),
        );

      let newAssignment = null;
      if (driverId) {
        [newAssignment] = await db
          .insert(vehicleAssignments)
          .values({
            vehicleId,
            driverId,
            isCurrent: true,
            status: "PENDING",
          })
          .returning();
      }

      return NextResponse.json({
        message: driverId
          ? "Phân công tài xế thành công!"
          : "Đã hủy phân công tài xế!",
        data: { updatedVehicle, newAssignment },
      });
    } catch (error: any) {
      console.error("Lỗi phân công tài xế:", error);
      return NextResponse.json(
        { error: "Cập nhật phân công tài xế thất bại" },
        { status: 500 },
      );
    }
  },
};
