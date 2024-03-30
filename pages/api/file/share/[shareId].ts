import { Share } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "@/helpers/validation/cookieValidations";
import prisma from "@/lib/prisma";
import jsPath from "path";
import fs from "fs"

type responseT<T> = {
    status: string,
    message?: string
    data: T | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).send({ status: "failed", message: "wrong method", data: null })
    let ret = { status: "ok", message: "success", data: null} as responseT<{name: string, type: string}[]>
    try {
        const path = req.query['path'] as string
        if (!path) return res.status(400).send({ status: "failed", message: "wrong body", data: null})
     
        const shareId = cookieValidations.verifyShare(req)
        if (shareId.error || !shareId.data?.id) {
            ret = { status: "failed", message: shareId.error, data: null}
            return res.status(403).send(ret)
        }
        const share = await prisma.share.findFirst({ where: { id: shareId.data?.id}})
        if (!share) return res.status(404).send({ status: "failed", message: "resource not found", data: null})
        const sourceRegex = new RegExp("^", share.sharedSource)
        if (!sourceRegex.test(path)) return res.status(403).send({ status: "failed", message: "access not granted", data: null})
        const returnPath = jsPath.join("serverFiles", "folders", share.userId, ...path.split("/"))
        if (!fs.existsSync(returnPath)) return res.status(404).send({ status: "failed", message: "resource does no longer exist", data: null})
        fs.readdir(returnPath, { withFileTypes: true},function (err, files) {
            //handling error
            if (err) {
                return res.status(500).send({ status: "failed", message: "Cannot list folder content - internal server error", data: null})
            } 
            //listing all files using forEach
            const returnFiles = files.map((file) => {
                return { name: file.name, type: file.isDirectory() ? "folder": "file"}
            }).filter((e) =>  !/^\./g.test(e.name)
            )
            ret.data = returnFiles
            return res.status(200).send(ret)
        });
    } catch (err) {
        ret = { status: "failed", message: "internal server error", data: null}
        return res.status(500).send(ret)
    }
}