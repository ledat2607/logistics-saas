const API_URL = "/api/schedule/routes";

export const scheduleService = {
  // Create new schedule record
  createSchedule: async (scheduleData: any) => {
    const response = await fetch(`${API_URL}/create-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    const resData = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof resData.error === "string"
          ? resData.error
          : resData.message || "Đã xảy ra lỗi khi tạo lịch trình";

      throw new Error(errorMessage);
    }
    return resData;
  },

  /*Get all schedule records */
  getAllSchedules: async () => {
    const response = await fetch(`${API_URL}/get-all-schedules`, {
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
          : resData.message || "Đã xảy ra lỗi khi lấy danh sách lịch trình";

      throw new Error(errorMessage);
    }
    return resData;
  },
};
