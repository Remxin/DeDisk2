import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "./lib/auth";

import { cookieValidations } from "./helpers/validation/cookieValidations";
import { verifyToken } from "./helpers/data/token";

export async function middleware(req: NextRequest) {
    const userToken = req.cookies.get("userToken")?.value
    const verifiedToken = userToken && (await verifyAuth(userToken).catch((err) => {
        return NextResponse.redirect(new URL("/login", req.url))
    }))

    if (!verifiedToken) return NextResponse.redirect(new URL("/login", req.url))
 
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api/user/register|register|login|images|api/user/login|favicon.ico|static|_next).*)"]
}