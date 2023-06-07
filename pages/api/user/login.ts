import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken } from '@/helpers/data/token'
import prisma from '@/lib/prisma'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    error?: {
        server?: string
        email?: string
        password?: string
    },
    user?: {
        id: string
        email: string
        name: string
        plan: string
    }
}

type Body = {
    email: string
    password: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    const { email, password } = req.body as Body




    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return res.status(404).send({ error: { email: "User not found" } })
        const validPass = hashHelpers.comparePass(user.password, password)

        if (!validPass) return res.status(401).send({ error: { password: "Wrong password" } })

        const token = signToken({ id: user.id }, "user", "5d")
        const cookie = serialize("user-token", token, { httpOnly: true })

        res.setHeader("Set-Cookie", cookie)
        return res.status(200).send({ user: { name: user.name, email, id: user.id, plan: user.plan } })
    } catch (err) {
        return res.status(500).send({ error: { server: "Unexpected server error" } })
    }
}