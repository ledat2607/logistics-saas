import { db } from "@/db";
import { maintenanceLogs, trips, user, vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { aliasedTable, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const scheduleController = {
  /* Create new schedule record */

  /*Get all schedule records */
    getAllSChedules: async () => {
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

        const tripsList = await db
          .select({
            trip: {
              id: trips.id,
              tripCode: trips.tripCode,
              startLocation: trips.startLocation,
              endLocation: trips.endLocation,
              estimatedStartTime: trips.estimatedStartTime,
              estimatedEndTime: trips.estimatedEndTime,
              actualStartTime: trips.actualStartTime,
              actualEndTime: trips.actualEndTime,
              status: trips.status,
              notes: trips.notes,
              distanceKm: trips.distanceKm,
              fuelConsumedLiters: trips.fuelConsumedLiters,
              tollCost: trips.tollCost,
              createdAt: trips.createdAt,
            },
            vehicle: {
              id: vehicles.id,
              licensePlate: vehicles.licensePlate,
              brand: vehicles.brand,
              model: vehicles.model,
              status: vehicles.status,
            },
            driver: {
              id: driverUser.id,
              name: driverUser.name,
              email: driverUser.email,
              image: driverUser.image,
            },
          })
          .from(trips)
          .innerJoin(vehicles, eq(trips.vehicleId, vehicles.id))
          .leftJoin(driverUser, eq(trips.driverId, driverUser.id))
          .where(eq(vehicles.ownerId, session.user.id))
          .orderBy(desc(trips.estimatedStartTime));

        const maintenanceList = await db
          .select({
            maintenance: {
              id: maintenanceLogs.id,
              description: maintenanceLogs.description,
              cost: maintenanceLogs.cost,
              status: maintenanceLogs.status,
              garageLocation: maintenanceLogs.garageLocation,
              maintenanceDate: maintenanceLogs.maintenanceDate,
              nextDueDate: maintenanceLogs.nextDueDate,
              createdAt: maintenanceLogs.createdAt,
            },
            vehicle: {
              id: vehicles.id,
              licensePlate: vehicles.licensePlate,
              brand: vehicles.brand,
              model: vehicles.model,
              status: vehicles.status,
            },
            driver: {
              id: driverUser.id,
              name: driverUser.name,
              email: driverUser.email,
              image: driverUser.image,
            },
          })
          .from(maintenanceLogs)
          .innerJoin(vehicles, eq(maintenanceLogs.vehicleId, vehicles.id))
          .leftJoin(driverUser, eq(vehicles.driverId, driverUser.id))
          .where(eq(vehicles.ownerId, session.user.id))
          .orderBy(desc(maintenanceLogs.maintenanceDate));

        const formattedTrips = tripsList.map(({ trip, vehicle, driver }) => ({
          id: `trip-${trip.id}`,
          originalId: trip.id,
          eventType: "TRIP" as const,
          title: trip.tripCode
            ? `[Chuyến ${trip.tripCode}] ${trip.startLocation} ➔ ${trip.endLocation}`
            : `[Chuyến xe] ${trip.startLocation} ➔ ${trip.endLocation}`,
          startDate: trip.estimatedStartTime,
          endDate: trip.estimatedEndTime || trip.estimatedStartTime,
          status: trip.status,
          vehicle,
          driver,
          details: {
            tripCode: trip.tripCode,
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            actualStartTime: trip.actualStartTime,
            actualEndTime: trip.actualEndTime,
            distanceKm: trip.distanceKm,
            fuelConsumedLiters: trip.fuelConsumedLiters,
            tollCost: trip.tollCost,
            notes: trip.notes,
          },
        }));

        const formattedMaintenances = maintenanceList.map(
          ({ maintenance, vehicle, driver }) => ({
            id: `maint-${maintenance.id}`,
            originalId: maintenance.id,
            eventType: "MAINTENANCE" as const,
            title: `[Bảo dưỡng] ${vehicle.licensePlate}`,
            startDate: maintenance.maintenanceDate,
            endDate: maintenance.nextDueDate || maintenance.maintenanceDate,
            status: maintenance.status,
            vehicle,
            driver,
            details: {
              description: maintenance.description,
              cost: maintenance.cost,
              garageLocation: maintenance.garageLocation,
              nextDueDate: maintenance.nextDueDate,
            },
          }),
        );

        const schedules = [...formattedTrips, ...formattedMaintenances].sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );

        return NextResponse.json({
          data: schedules,
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || "Lấy danh sách xe thất bại" },
          { status: 500 },
        );
      }
    },
};
