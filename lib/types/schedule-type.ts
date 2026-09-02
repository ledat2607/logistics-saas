export type ScheduleEvent = {
  id: string;
  originalId: string;
  title: string;
  eventType: string;
  startDate: string;
  endDate: string;
  status: string;
  details: {
    tripCode: string | null;
    startLocation: string;
    endLocation: string;
    notes: string | null;
    actualStartTime: string | null;
    actualEndTime: string | null;
    distanceKm: number | null;
    fuelConsumedLiters: number | null;
    tollCost: number | null;
  };
  driver: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
  vehicle: {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    status: string;
  };
};
