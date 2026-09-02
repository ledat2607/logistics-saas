import { NextRequest } from "next/server";
import { scheduleController } from "../../controllers/schedule.controller";

export async function POST(request: NextRequest) {
  return scheduleController.createSChedule(request);
}
