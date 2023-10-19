import { calculateSeconds } from '@/helpers/data/date'
import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken } from '@/helpers/data/token'
import { createUserHomeDir } from '@/helpers/fs/dir'
import prisma from '@/lib/prisma'
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") return res.status(405).send({ error: { server: "Wrong method" } })
    const { name, email, password } = req.body as Body
    const hashedPass = (await hashHelpers.hashPass(password)).res!

    if (!hashedPass) return res.status(500).send({ error: { server: "Unexpected server error" } })

    try {

        const user = await prisma.user.create({ data: { name, email, password: hashedPass } })
        // console.log(name, email, password, hashedPass) 
        const token = signToken({ id: user.id }, "user", "5d")
        await createUserHomeDir(user.id)
        const cookie = serialize("userToken", token, { path: "/", maxAge: calculateSeconds("days", 5)})

        res.setHeader("Set-Cookie", cookie)
        return res.status(200).send({ user: { name, email, id: user.id, plan: user.plan, usedSpace: user.usedSpace } })
    } catch (err) {
        //@ts-ignore
        if (err?.code === "P2002") return res.status(500).send({ error: { server: "User with this email already exists" } })
        return res.status(500).send({ error: { server: "Unexpected server error" } })
    }
}