import { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "../fs/file";
import { cookieValidations } from "../validation/cookieValidations";



type ProcessedFiles = Array<[string, File]>

export const fileControllers = {
    sendFiles: async (req: NextApiRequest, res: NextApiResponse) => {

        let status = 200,
        resultBody = { status: "ok", message: "Files were uploaded successfully"}
        const cookies = cookieValidations.verifyUser(req)

        if (cookies.error) return res.status(401).send({ error: cookies.error.user })
        
        try {
            const file = await readFile(req, true, cookies.data.id)
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong"}
        } 
        res.status(status).send(resultBody)
    }
}