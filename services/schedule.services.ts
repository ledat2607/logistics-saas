const API_URL = "/api/schedule/routes";

export const scheduleService = {
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
