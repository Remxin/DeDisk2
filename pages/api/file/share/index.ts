import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "@/helpers/validation/cookieValidations";

// prisma
import prisma from "@/lib/prisma";

// email
import { sendEmail } from "@/emails/sendEmail";
import { ShareEmail } from "@/emails/templates/ShareEmail";

// type
type ReturnT<T> = {
    status: string
    message: string
    data: null | T
}

// token
import { signToken } from "@/helpers/data/token";
import { Share } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let ret = { status: "ok", message: "emails successfully sendt", data: null }
        const cookies = cookieValidations.verifyUser(req)
        if (cookies.error) {
            ret = { status: "failed", message: "user not authenticated", data: null}
            return res.status(403).send(res)
        }
        
        try {
            let { emails, expiresIn, filepath } = JSON.parse(req.body) as { emails: string[], expiresIn: string, filepath: string }
            const user = await prisma.user.findUnique({ where: { id: cookies.data.id }})
            if (!user) {
                ret = { status: "failed", message: "user not authenticated, please allow cookies for this site", data: null}
                return res.status(403).send(ret)
            }
            
          
            if (!emails || expiresIn === null || !filepath) {
                ret = { status: "failed", message: "wrong body ", data: null}
                return res.status(400).send(ret)
            }
            filepath = filepath.replaceAll("//", "/")
     
            const token = signToken({ filepath, userId: user.id }, "share", expiresIn)
            await prisma.share.create({ data: { userId: user.id, token, sharedTo: JSON.stringify(emails), sharedSource: filepath}})
           

            for (let receiver of emails) {
                sendEmail(ShareEmail({sharerName: user.name, resourceName: filepath, token, name: receiver }), receiver, `${user.name} shared you files`)
            }

            return res.status(200).send(ret)
        } catch(err) {
            ret = { status: "failed", message: "internal server error", data: null}
            return res.status(500).send(ret)
        }
    } else if (req.method === "GET") {
        let ret: ReturnT<Share[]> = { status: "ok", message: "success", data: null } 

        try {
            const cookies = await cookieValidations.verifyUser(req)
            if (cookies.error) {
                ret = { status: "failed", message: "user not authenticated", data: null}
                return res.status(403).send(res)
            }

            const sharedSources = await prisma.share.findMany({ where: { userId: cookies.data.id }})
            ret.data = sharedSources

            return res.status(200).send(ret)

        } catch(err) {
            ret = { status: "failed", message: "internal server error", data: null}
           
            return res.status(500).send(ret)
        }
    }
}