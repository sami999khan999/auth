import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const authPath = ["/auth/login", "/auth/register"];
const protectedPath = ["/profile", "/dashboard"];
const adminPath = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const pathname = req.nextUrl.pathname;

  const isAuthPage = authPath.includes(pathname);
  const isProtectedPage = protectedPath.includes(pathname);
  const isAdminPage = adminPath.includes(pathname);

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedPage && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAdminPage && refreshToken) {
    const payload = await verifyToken(refreshToken);

    console.log(payload);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/register", "/profile", "/dashboard"],
};
