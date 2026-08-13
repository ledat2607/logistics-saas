import { scheduleController } from "../../controllers/schedule.controller";

export async function GET() {
  return scheduleController.getAllSChedules();
}
