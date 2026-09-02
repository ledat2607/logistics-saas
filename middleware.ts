import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Import instance auth ở Server bạn tạo ở Bước 6 bài trước
import { limitRequest } from "./lib/rate-limit";

export async function middleware(request: NextRequest) {
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

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await limitRequest.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          message: "Quá nhiều yêu cầu !!!",
        },
        { status: 429 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup", "/api/:path*"],
};
