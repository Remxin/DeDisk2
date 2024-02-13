import { cookieValidations } from '@/helpers/validation/cookieValidations'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'






export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    let userData = { id: "", name: "", email: "", plan: "", createDate: new Date(), usedSpace: "0B", error: "", success: true}
    
    const token = cookieValidations.verifyUser(req)
    if (token.error) {
        userData.success = false
        userData.error = "Invalid user token"
        return res.status(401).send(userData)
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: token.data.id } })
        if (!user) {
            userData.error = "User does not exist"
            userData.success = false
            return res.status(404).send(userData)
        }
        userData.id = user.id
        userData.name = user.name
        userData.email = user.email
        userData.createDate = user.createDate
        userData.usedSpace = user.usedSpace
    
        return res.status(200).send(userData)

    } catch (err) {
        userData.error = "unknown user error"
        userData.success = false
        return res.status(500).send(userData)
    }

}