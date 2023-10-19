import { fileControllers } from '@/helpers/controllers/file'
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== "POST") return res.status(405).send({ status: "fail", message: "method not allowed", data: null})
    fileControllers.removeFromFavourites(req, res)
}