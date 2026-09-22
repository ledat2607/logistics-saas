import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { limitRequest } from "./lib/rate-limit";

// 1. Khai báo middleware của next-intl
const intlMiddleware = createMiddleware({
  locales: ["vi", "en"],
  defaultLocale: "vi",
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Xử lý Rate Limit cho các đường dẫn /api (Bỏ qua i18n cho API)
  if (pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await limitRequest.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Quá nhiều yêu cầu !!!" },
        { status: 429 },
      );
    }
    return NextResponse.next();
  }

  // 3. Tách tiền tố locale ra khỏi pathname để kiểm tra Auth chính xác
  // Ví dụ: "/vi/dashboard/settings" -> "/dashboard/settings"
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";

  const isDashboardRoute = pathnameWithoutLocale.startsWith("/dashboard");
  const isAuthRoute =
    pathnameWithoutLocale.startsWith("/signin") ||
    pathnameWithoutLocale.startsWith("/signup");

  // 4. Lấy session người dùng
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 5. Kiểm tra điều hướng Auth
  if (isDashboardRoute && !session) {
    // Chưa đăng nhập -> Chuyển hướng về /login (intlMiddleware sẽ tự thêm locale)
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && session) {
    // Đã đăng nhập -> Chuyển hướng vào /dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 6. Cho next-intl xử lý định tuyến locale cho các request còn lại
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Bỏ qua các tệp tĩnh, favicon, _next, v.v.
    "/((?!_next|_vercel|.*\\..*).*)",
    "/",
    "/(vi|en)/:path*",
    "/api/:path*",
  ],
};
