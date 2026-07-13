import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Import instance auth ở Server bạn tạo ở Bước 6 bài trước

export async function middleware(request: NextRequest) {
  // 1. Lấy thông tin session từ request (Better-Auth tự động đọc từ cookie)
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (isDashboardRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Trường hợp: Đã đăng nhập rồi mà vẫn cố vào lại trang signin/signup
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Chỉ chạy middleware trên các đường dẫn này để tối ưu hiệu năng
export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
