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

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/fleet/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    let resData;
    try {
      resData = await response.json();
    } catch (e) {
      resData = null;
    }

    if (!response.ok) {
      const errorMessage =
        typeof resData?.error === "string"
          ? resData.error
          : resData?.message ||
            `Lỗi ${response.status}: Đã xảy ra lỗi khi xóa phương tiện`;

      throw new Error(errorMessage);
    }

    return resData;
  },
  update: async (id: string, data: VehicleSchema) => {
    const response = await fetch(`${API_URL}/update-fleets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    let resData;
    try {
      resData = await response.json();
    } catch (e) {
      resData = null;
    }

    if (!response.ok) {
      const errorMessage =
        typeof resData?.error === "string"
          ? resData.error
          : resData?.message ||
            `Lỗi ${response.status}: Đã xảy ra lỗi khi cập nhật phương tiện`;

      throw new Error(errorMessage);
    }

    return resData;
  },

  getDrivers: async () => {
    const response = await fetch(`${API_URL}/get-drivers`, {
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
          : resData.message || "Đã xảy ra lỗi khi lấy danh sách tài xế";

      throw new Error(errorMessage);
    }

    return resData;
  },

  assignDriver: async ({
    vehicleId,
    driverId,
  }: {
    vehicleId: string;
    driverId: string;
  }) => {
    const response = await fetch(`${API_URL}/assign-drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vehicleId, driverId }),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof resData.error === "string"
          ? resData.error
          : resData.message || "Đã xảy ra lỗi khi lấy danh sách tài xế";

      throw new Error(errorMessage);
    }

    return resData;
  },
};
