import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "../validation/cookieValidations";
import prisma from "@/lib/prisma";
import { createUserDir, listDir } from "../fs/dir";
import { getLastUrlPart } from "../data/links";

export const dirControllers = {
    createDir: async (req: NextApiRequest, res: NextApiResponse) => {
        const token = cookieValidations.verifyUser(req)
        const { pathName } = JSON.parse(req.body) as { pathName: string }
        
        if (token.error) return res.status(403).send(token.error)
        
        try {
            const dirPath = await createUserDir(token.data.id, pathName)
            if (!dirPath) return res.status(500).send({ error: { server: "Unknown server error" } })
            
            return res.status(200).send({ path: dirPath })
        } catch (err) {
            //@ts-ignore
            return res.status(500).send({ error: { server: err?.message } })
        }
    },

    listDirContent: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.send({ error: { server: "Wrong url provided"}})
        const token = cookieValidations.verifyUser(req)
        
        let pathName = getLastUrlPart(req.url)
        pathName = pathName.replaceAll("%7C", "/")
        if (token.error) return res.status(403).send(token.error)

        try {
            const dirList = await listDir(token.data.id, pathName)
            console.log(dirList)
            return res.send({ data: dirList})
        } catch (err) {
            return res.status(500).send({ error: { server: "Unknown server error" } })
        }
    }


}