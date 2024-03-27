import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

import { verifyAuth } from "./lib/auth";

import { cookieValidations } from "./helpers/validation/cookieValidations";
import { verifyToken } from "./helpers/data/token";

const allowedContextKeys = ["userId"]

async function loginMiddleware(req: NextRequest) {
    const userToken = req.cookies.get("userToken")?.value
    const verifiedToken = userToken && (await verifyAuth(userToken).catch((err) => {
        return NextResponse.next()
    }))
    if (verifiedToken) return NextResponse.redirect(new URL("/", req.url))
}

export async function middleware(req: NextRequest) {

    if (/.*\/login/g.test(req.url)) return loginMiddleware(req)
    const userToken = req.cookies.get("userToken")?.value
    const verifiedToken = userToken && (await verifyAuth(userToken).catch((err) => {
        return NextResponse.redirect(new URL("/login", req.url))
    }))

    if (!verifiedToken) return NextResponse.redirect(new URL("/login", req.url))
 
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api/user/register|register|shared|images|lottie|api/user/login|favicon.ico|static|_next|public).*)"]
}