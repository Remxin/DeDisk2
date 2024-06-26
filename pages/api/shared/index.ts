import { NextApiRequest, NextApiResponse } from "next";
import { cookieValidations } from "@/helpers/validation/cookieValidations";
import { listDir } from "@/helpers/fs/dir";

type responseT = {
    status: "ok" | "failed"
    message: string
    data: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let ret: responseT = {status: "ok", message: "success", data: null}
    if (req.method !== "GET") {
        ret = { status: "failed", message: "wrong method", data: null}
        return res.status(405).send(ret)
    }

    let { token, path } = req.query as { token: string, path: string}
    path = path.replaceAll("%2F", "/")
    console.log(path)
    // path[-1] === "%2F" ? path.slice(0,-1) : null
    // console.log(path)
    
    const tokenData = cookieValidations.verifyShare(req)
    if (!token || !path || tokenData.error) {
        ret = { status: "failed", message: "missing query params", data: null}
        return res.status(406).send(ret)
    }
    
    const { userId, filepath} = tokenData.data!
    const dirData = await listDir(userId, `${filepath}/${path}`)
    ret.data = dirData
    return res.status(200).send(ret)

}