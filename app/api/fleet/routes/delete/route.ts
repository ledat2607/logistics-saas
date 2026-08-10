import { NextRequest } from "next/server";
import { fleetController } from "../../controllers/fleet.controller";

export async function DELETE(request: NextRequest) {
  return fleetController.deleteFleet(request);
}
