import { NextRequest } from "next/server";
import { maintenanceController } from "../../controllers/maintaince.controller";

export async function DELETE(request: NextRequest) {
  return maintenanceController.deleteMaintainceRecord(request);
}
