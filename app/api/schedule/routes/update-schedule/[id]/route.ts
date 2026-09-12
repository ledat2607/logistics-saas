import { scheduleController } from "../../../controllers/schedule.controller";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return scheduleController.updateSchedule(request, {
    params: params,
  });
}
