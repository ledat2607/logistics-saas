// Định nghĩa kiểu dữ liệu khớp hoàn toàn với z.infer<typeof signUpSchema> từ form của cậu
export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  companyName?: string;
  role?: string; // Nhận từ RadioGroup (Fleet Manager, Dispatcher, Driver)
  fleetSize?: string | number;
}

export interface SignInInput {
  email: string;
  password: string;
}

const API_URL = "/api/auth";

export const authService = {
  /**
   * API Đăng ký tài khoản (Gửi dữ liệu đến endpoint xử lý tập trung)
   */
  register: async (data: SignUpInput) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.error || "Đăng ký tài khoản thất bại");
    }

    return resData;
  },

  /**
   * API Đăng nhập tài khoản
   */
  login: async (data: SignInInput) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.error || "Đăng nhập thất bại");
    }

    return resData;
  }
};