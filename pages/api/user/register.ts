// helpers
import { calculateSeconds } from '@/helpers/data/date'

// token
import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken } from '@/helpers/data/token'

// fs
import { createUserHomeDir } from '@/helpers/fs/dir'

// prisma
import prisma from '@/lib/prisma'

// cookies
import { serialize } from 'cookie'

// api
import type { NextApiRequest, NextApiResponse } from 'next'

// validation
import { z } from 'zod'

type Data = {
    error?: {
        server: string
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
    name: string
    email: string
    password: string

}

const bodySchema = z.object({
    name: z.string(),
    email: z.string().email({ message: "Provided email is not valid"}),
    password: z.string().min(6, { message: "Password must contain at least 6 signs"})
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    const { name, email, password } = req.body as Body
    const validBody = bodySchema.safeParse({ name, email, password })
   
    if (!validBody.success) {
        return res.status(400).send({ error: { server: "Wrong body" }})
    }
    const hashedPass = (await hashHelpers.hashPass(password)).res!

    if (!hashedPass) return res.status(500).send({ error: { server: "Unexpected server error" } })

    try {

        const user = await prisma.user.create({ data: { name, email, password: hashedPass } })
        const token = signToken({ id: user.id }, "user", "5d")
        await createUserHomeDir(user.id, user.name)
        const cookie = serialize("userToken", token, { path: "/", maxAge: calculateSeconds("days", 5)})

        res.setHeader("Set-Cookie", cookie)
        return res.status(200).send({ user: { name, email, id: user.id, plan: user.plan, usedSpace: user.usedSpace } })
    } catch (err) {
        //@ts-ignore
        if (err?.code === "P2002") return res.status(500).send({ error: { server: "User with this email already exists" } })
        return res.status(500).send({ error: { server: "Unexpected server error" } })
    }
}