import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "../validation/cookieValidations";
import prisma from "@/lib/prisma";
import { createUserDir } from "../fs/dir";

export const dirControllers = {
    createDir: async (req: NextApiRequest, res: NextApiResponse) => {
        const token = cookieValidations.verifyUser(req)
        const { pathName } = req.body as { pathName: string }

        if (token.error) return res.status(403).send(token.error)

        try {
            const dirPath = await createUserDir(token.data.id, pathName)
            if (!dirPath) return res.status(500).send({ error: { server: "Unknown server error" } })

            return res.status(200).send({ path: dirPath })
        } catch (err) {
            return res.status(500).send({ error: { server: "Unknown server error" } })
        }
    }
}