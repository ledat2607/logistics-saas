import { CreateMaintenanceInput } from "@/lib/types/fleet-type";

const API_URL = "/api/maintaince/routes";

export const maintenanceService = {
  /*Create maintaince */
  createMaintenanceRecord: async (data: CreateMaintenanceInput) => {
    const response = await fetch(`${API_URL}/create-maintaince`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof resData.error === "string"
          ? resData.error
          : resData.message || "Đã xảy ra lỗi khi thêm mới phương tiện";

      throw new Error(errorMessage);
    }
    return resData;
  },
};
