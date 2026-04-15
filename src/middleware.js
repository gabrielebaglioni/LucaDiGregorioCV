import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/index" || pathname.startsWith("/index/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/index/, "/collection");
    return NextResponse.rewrite(url);
  }

  if (pathname === "/collection" || pathname.startsWith("/collection/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/collection/, "/index");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/index/:path*", "/collection/:path*"],
};
