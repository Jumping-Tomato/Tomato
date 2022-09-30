import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
    const session = await getToken({ req, secret: "test" })
    const in_authentication_page = req.url.includes("/auth/signin") || req.url.includes("/auth/register");
  
    if (session && in_authentication_page) {
      return NextResponse.rewrite(new URL('/', req.url))
    }
    if (!session && !in_authentication_page){
      return NextResponse.rewrite(new URL('/auth/signin', req.url))
    } 

    // If user is authenticated, continue.
    return NextResponse.next()
  
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/((?!_next|api/auth|api/register).*)(.+)'
  ],
}