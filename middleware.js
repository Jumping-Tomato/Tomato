import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, })
    const is_unprotected_page = req.url.includes("/auth/signin") ||
                                    req.url.includes("/auth/register") ||
                                    req.url.includes("/auth/password-retrieval") ||
                                    req.url.includes("/auth/verify-email") ;
    
    if (session && is_unprotected_page) {
      return NextResponse.redirect(process.env.NEXTAUTH_URL); 
    }
    if(session && session.role != "teacher" && req.url.includes("/teacher")){
      return NextResponse.redirect(process.env.NEXTAUTH_URL + "/error/forbidden"); 
    }
    if(session && session.role != "student" && req.url.includes("/student")){
      return NextResponse.redirect(process.env.NEXTAUTH_URL + "/error/forbidden"); 
    }
    if (!session && !is_unprotected_page){
      return NextResponse.redirect(process.env.NEXTAUTH_URL +  '/auth/signin');
    } 

    return NextResponse.next();
  
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/((?!_next|api/auth|images|gifs|contact|pricing|privacy-policy).*)(.+)' //put '_next' as a temporary fix. This is an issue of Next.js of the newest versions
  ],
}