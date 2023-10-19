import { fileControllers } from '@/helpers/controllers/file'
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

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") return fileControllers.sendFiles(req, res)

}