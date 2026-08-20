import { maintenanceController } from "../../../controllers/maintaince.controller";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return maintenanceController.updateMaintenanceRecord(request, {
    params: params,
  });
}
