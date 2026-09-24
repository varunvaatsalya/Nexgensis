import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = Boolean(token);

  // 1. Root route "/" redirection
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Already authenticated user trying to access "/login"
  if (pathname.startsWith("/login")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
    return NextResponse.next();
  }

  // 3. Unauthenticated user trying to access protected routes (e.g. "/products")
  if (pathname.startsWith("/products")) {
    if (!isAuthenticated) {
      const redirectUrl = new URL("/login", request.url);
      if (pathname !== "/products" || search) {
        redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
      }
      return NextResponse.redirect(redirectUrl);
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
