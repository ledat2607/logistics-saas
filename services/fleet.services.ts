import { VehicleSchema } from "@/lib/types/fleet-type";

const API_URL = "/api/fleet";

export const fleetService = {
  /**
   * API Đăng ký tài khoản (Gửi dữ liệu đến endpoint xử lý tập trung)
   */
  create: async (data: VehicleSchema) => {
    const response = await fetch(`${API_URL}/create`, {
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
  getAllFleets: async () => {
    const response = await fetch(`${API_URL}/getAllFleet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
