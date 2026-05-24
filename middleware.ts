import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(req: NextRequest) {
  const adminToken = req.cookies.get("admin_token")?.value;
  const userToken = req.cookies.get("user_token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Protect admin dashboard pages
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(adminToken, secret);
      return NextResponse.next();
    } catch {
      // Admin token expired or invalid
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // 2. Protect public inner pages (gate all except homepage, login, register, and contact)
  const publicPaths = ["/", "/login", "/register", "/contact"];
  if (!publicPaths.includes(pathname)) {
    if (!userToken && !adminToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const tokenToVerify = userToken || adminToken;
    const isUser = !!userToken;

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(tokenToVerify!, secret);
      return NextResponse.next();
    } catch {
      // Token expired or invalid
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (isUser) {
        response.cookies.delete("user_token");
        response.cookies.delete("mieux_user_logged_in");
      } else {
        response.cookies.delete("admin_token");
        response.cookies.delete("mieux_admin_logged_in");
        response.cookies.delete("mieux_user_logged_in");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with an extension (e.g. image.jpg, logo.svg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
