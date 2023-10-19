import { fileControllers } from '@/helpers/controllers/file'
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "POST") return fileControllers.addToFavourites(req, res) 
    else if (req.method === "GET") return fileControllers.getFavourites(req, res)
    else return res.status(405).send({ status: "fail", message: "method not allowed", data: null})
}