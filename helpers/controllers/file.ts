import { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "../fs/file";
import { cookieValidations } from "../validation/cookieValidations";



type ProcessedFiles = Array<[string, File]>
type responseType = {
    status: string
    message: string
    data: string[] | null
}

export const fileControllers = {
    sendFiles: async (req: NextApiRequest, res: NextApiResponse) => {

        let status = 200,
        resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)

        if (cookies.error) return res.status(401).send({ error: cookies.error.user })
        
        try {
            const file: any = await readFile(req, true, cookies.data.id)
            let filesNames = []
            console.log(file)

            for (let i = 0; i < Object.keys(file.files).length; i++) {
                const fileData = file.files['File' + i][0]
                filesNames.push(fileData.originalFilename)
            }
          
            resultBody = { status: "ok", message: "Files were uploaded successfully", data: filesNames}
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        } 
        res.status(status).send(resultBody)
    }
}