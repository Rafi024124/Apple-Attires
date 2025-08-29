// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Only run middleware on admin paths
  if (url.pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
     console.log("TOKEN:", token);
  console.log("PATH:", req.nextUrl.pathname);
    if (!token) {
      // redirect to login
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Match all admin routes
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
