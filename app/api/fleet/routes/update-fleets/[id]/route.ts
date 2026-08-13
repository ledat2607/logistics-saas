import { NextRequest } from "next/server";
import { fleetController } from "../../../controllers/fleet.controller";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return fleetController.updateFleet(request, { params });
}
