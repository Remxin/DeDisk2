import { dirControllers } from '@/helpers/controllers/dir'
import { hashHelpers } from '@/helpers/data/hashHelpers'
import { signToken, verifyToken } from '@/helpers/data/token'
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
    dirName: string
    location: string
}

type Cookies = {
    token: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") return dirControllers.createDir(req, res)
    else if (req.method === "GET") return dirControllers.listDirContent(req, res)


}