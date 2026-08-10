import { fleetController } from "../../controllers/fleet.controller";

export async function GET() {
  return fleetController.getAllFleet();
}
