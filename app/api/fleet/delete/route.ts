import { NextRequest } from "next/server";
import { fleetController } from "../controllers/fleet.controller";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return fleetController.deleteFleet(request, { params });
}
