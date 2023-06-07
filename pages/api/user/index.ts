import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken } from '@/helpers/data/token'
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "DELETE") return res.status(405).send({ error: { server: "Wrong method" } })
    await prisma.user.deleteMany()
    res.status(200).send({ msg: "Deleted users" })
}