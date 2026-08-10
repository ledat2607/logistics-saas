import { NextRequest } from "next/server";
import { fleetController } from "../../controllers/fleet.controller";

export async function POST(request: NextRequest) {
  return fleetController.assignDriver(request);
}
