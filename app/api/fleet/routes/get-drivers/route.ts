import { NextRequest } from "next/server";
import { fleetController } from "../../controllers/fleet.controller";

export async function GET(request: NextRequest) {
  return fleetController.getDrivers(request);
}
