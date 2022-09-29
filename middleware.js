import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
    const session = await getToken({ req, secret: "test" })
    if (session && req.url.includes("/auth/signin") || req.url.includes("/auth/register")) {
      return NextResponse.rewrite(new URL('/', req.url))
    }
    
  
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/:path*'
  ],
}