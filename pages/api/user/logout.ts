import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // return res.status(500).send({ status: "failed" })
    if (req.method !== "POST") return res.status(405).send({ status: "failed", message: "Method not allowed"})

    try {
        const cookie = serialize("userToken", "", { path: "/", maxAge: 0})
        res.setHeader("Set-Cookie", cookie)
    } catch (err) {
        return res.status(500).send({ status: "failed", message: "internal server error"})
    }

    res.status(200).send({ status: "ok", message: "success"})
} 