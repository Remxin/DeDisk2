import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken, verifyToken } from '@/helpers/data/token'
import prisma from '@/lib/prisma'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

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

    const token = req.cookies['user-token']
    if (!token) return res.status(401).send({ error: { user: "User not verified" } })

    const { id } = verifyToken(token, "user") as { id: string }
    if (!id) return res.status(401).send({ error: { user: "User not verified" } })

    try {
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) return res.status(404).send({ error: { user: "User not found" } })

        res.status(200).send({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan } })

    } catch (err) {
        return res.status(500).send({ error: { server: "Unknown server error" } })
    }

}