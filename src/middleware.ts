import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {
  if(req.nextUrl.pathname.startsWith("/login") && req.nextauth.token!==null){
    return NextResponse.redirect(new URL("/dasboard", req.url));
  }
  if((req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/users")) && req.nextauth.token === null){
    return NextResponse.redirect(new URL("/login",req.url));
  }
  NextResponse.next();
}, {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async authorized({ token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*","/login","/users/:path","/dummy/:path*"],
};
