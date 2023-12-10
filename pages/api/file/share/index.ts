import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "@/helpers/validation/cookieValidations";

// prisma
import prisma from "@/lib/prisma";

// email
import { sendEmail } from "@/emails/sendEmail";
import { ShareEmail } from "@/emails/templates/ShareEmail";

// token
import { signToken } from "@/helpers/data/token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let ret = { status: "ok", message: "emails successfully sendt", data: null }
        const cookies = cookieValidations.verifyUser(req)
        if (cookies.error) {
            ret = { status: "failed", message: "user not authenticated", data: null}
            return res.status(403).send(res)
        }
        
        try {
            const { emails, expiresIn, filepath } = JSON.parse(req.body) as { emails: string[], expiresIn: string, filepath: string }
            const user = await prisma.user.findUnique({ where: { id: cookies.data.id }})
            
            if (!user) {
                ret = { status: "failed", message: "user not authenticated, please allow cookies for this site", data: null}
                return res.status(403).send(ret)
            }
            console.log(emails,expiresIn, filepath)
            if (!emails || !expiresIn || !filepath) {
                ret = { status: "failed", message: "wrong body ", data: null}
                return res.status(400).send(ret)
            }

            const token = signToken({ filepath, userId: user.id }, "share", expiresIn)
            for (let receiver of emails) {
                sendEmail(ShareEmail({sharerName: user.name, resourceName: filepath, token, name: receiver }), receiver, `${user.name} shared you files`)
            }

            return res.status(200).send(ret)
        } catch(err) {
            ret = { status: "failed", message: "internal server error", data: null}
            return res.status(500).send(ret)
        }
    }
}