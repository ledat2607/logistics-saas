import { db } from "@/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { user } from "@/db/schema";
import bcrypt from "bcrypt";

export const authController = {
  register: async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { email, password, name, companyName, role, fleetSize } = body;

      const userSession = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
          // Truyền phẳng các trường này ra ngoài
          companyName: companyName || null,
          role: role || "DRIVER",
          fleetSize: fleetSize ? parseInt(fleetSize) : 0,
        },
      });

      // Trả về kết quả (Hàm signUpEmail tự động lo hash pass, tạo account, tạo session)
      return NextResponse.json(
        { message: "Đăng ký thành công!", user: userSession.user },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Đăng ký tài khoản thất bại" },
        { status: 400 },
      );
    }
  },
};
