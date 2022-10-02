import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, })
    const in_authentication_page = req.url.includes("/auth/signin") || 
                                    req.url.includes("/auth/register") || 
                                    req.url.includes("/auth/forgot-password");
  
    if (session && in_authentication_page) {
      return NextResponse.redirect(process.env.NEXTAUTH_URL); 
    }
    if (!session && !in_authentication_page){
      return NextResponse.redirect(process.env.NEXTAUTH_URL +  '/auth/signin');
    } 

    return NextResponse.next();
  
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/((?!_next|api/auth).*)(.+)' //put '_next' as a temporary fix. This is an issue of Next.js of the newest versions
  ],
}