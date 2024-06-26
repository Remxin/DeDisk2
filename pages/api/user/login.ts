import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken } from '@/helpers/data/token'
import prisma from '@/lib/prisma'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

// helpers
import { calculateSeconds } from '@/helpers/data/date'

// validation
import { z } from 'zod'

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
        usedSpace: string
    }
}

type Body = {
    email: string
    password: string
}

const bodySchema = z.object({ 
    email: z.string().email(),
    password: z.string().min(6)
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    const body = req.body as Body
    const validBody = bodySchema.safeParse(body)
    if (!validBody.success) {
        return res.status(400).send({ error: { server: "Wrong request body"}})
    }
    const { email, password } = body

try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).send({ error: { email: "User not found" } })
    const validPass = await hashHelpers.comparePass(user.password, password)
    if (!validPass.res) return res.status(401).send({ error: { password: "Wrong password" } })

        const token = signToken({ id: user.id }, "user", "5d")
        const cookie = serialize("userToken", token, { path: "/", maxAge: calculateSeconds("days", 5)})
        res.setHeader("Set-Cookie", cookie)
        return res.status(200).send({ user: { name: user.name, email, id: user.id, plan: user.plan, usedSpace: user.usedSpace } })
    } catch (err) {
        return res.status(500).send({ error: { server: "Unexpected server error" } })
    }
}