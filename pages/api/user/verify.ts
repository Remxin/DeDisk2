import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken, verifyToken } from '@/helpers/data/token'
import { cookieValidations } from '@/helpers/validation/cookieValidations'
import prisma from '@/lib/prisma'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cookies } from 'next/dist/client/components/headers'

// type Data = {
//     error?: {
//         server?: string
//         email?: string
//         password?: string
//     },
//     user?: {
//         id: string
//         email: string
//         name: string
//         plan: string
//     }
// }

type Body = {
    email: string
    password: string
}

type Cookies = {
    token: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    
    const token = cookieValidations.verifyUser(req)
    if (token.error) return res.status(401).send(token.error)

    try {
        const user = await prisma.user.findUnique({ where: { id: token.data.id } })
        if (!user) return res.status(404).send({ error: { user: "User not found" } })

        res.status(200).send({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan } })

    } catch (err) {
        return res.status(500).send({ error: { server: "Unknown server error" } })
    }

}