import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, vehicles } from "@/db/schema";
import { createVehicleSchema } from "@/lib/validations/fleet-validations";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc, eq } from "drizzle-orm";

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

  getAllFleet: async (request: NextRequest) => {
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

      const fleetList = await db
        .select({
          vehicle: vehicles,
          owner: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(vehicles)
        .leftJoin(user, eq(vehicles.ownerId, user.id))
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
};
