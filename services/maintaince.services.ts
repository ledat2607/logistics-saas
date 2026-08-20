import { MaintenanceSchedule } from "@/components/dashboard-component/schedule/maintaince-update";
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
  /*Delete maintaince */
  deleteMaintaince: async (id: string) => {
    if (!id) {
      throw new Error("ID bản ghi không hợp lệ.");
    }

    // Gửi ID trực tiếp qua Query Parameter (?id=...)
    const response = await fetch(`${API_URL}/delete-maintaince?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
            `Lỗi ${response.status}: Đã xảy ra lỗi khi xóa bản ghi`;

      throw new Error(errorMessage);
    }

    return resData;
  },

   updateMaintaince: async (id: string, data: MaintenanceSchedule) => {
      const response = await fetch(`${API_URL}/update-maintaince/${id}`, {
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
};
