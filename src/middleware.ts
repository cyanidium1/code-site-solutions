import { NextResponse, type NextRequest } from "next/server";

// Expose the request pathname as a response/request header so server
// components (e.g. the root layout) can set `<html lang>` based on the
// current locale prefix without resorting to client-side rewriting.
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
