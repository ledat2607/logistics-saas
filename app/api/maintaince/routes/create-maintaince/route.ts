import { NextRequest } from "next/server";
import { maintenanceController } from "../../controllers/maintaince.controller";

export async function POST(request: NextRequest) {
  return maintenanceController.createMaintenanceRecord(request);
}
