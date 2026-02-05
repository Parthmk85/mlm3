import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth;
        const { pathname } = req.nextUrl;

        // Admin-only routes
        if (pathname.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Redirect to /pay if user is pending and trying to access main features
        // (Note: This is also handled in-page, but middleware is more robust)
        // if (token?.status === "pending" && 
        //     (pathname === "/" || pathname.startsWith("/vip") || pathname.startsWith("/tasks"))) {
        //   return NextResponse.redirect(new URL("/pay", req.url));
        // }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Define which paths are protected
export const config = {
    matcher: [
        "/profile/:path*",
        "/admin/:path*",
        "/vip/:path*",
        "/tasks/:path*",
        "/team/:path*",
        "/pay/:path*",
    ],
};
