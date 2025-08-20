import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?redirect=/admin", request.url)
      );
    }

    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    //   if (decoded.role !== "ADMIN") {
    //     return NextResponse.redirect(new URL("/", request.url));
    //   }
    // } catch (error) {
    //   return NextResponse.redirect(
    //     new URL("/login?redirect=/admin", request.url)
    //   );
    // }

    // i will use the admin guard temporary
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
