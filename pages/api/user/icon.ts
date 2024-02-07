import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

import fs from "fs"
import path from "path";
import { cookieValidations } from "@/helpers/validation/cookieValidations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).send({ status: "failed", message: "Wrong request method"})
    // const userId = req.("userToken")?.value
    const userToken = req.cookies?.["userToken"]

    if (!userToken || userToken.length === 0) return res.status(400).send({ status: "failed", message: "Allow cookies first"})

    const userId = cookieValidations.verifyUser(req)?.data?.id
    if (!userId) return res.status(400).send({ status: "failed", message: "User not authenticated"})
    const avatar = await fs.readFileSync(path.join("serverFiles", "folders", userId, ".__metadata__", "icon.png"))
    console.log(avatar)
    res.status(200).send(avatar)
} 