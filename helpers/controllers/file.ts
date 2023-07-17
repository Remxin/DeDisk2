import { NextApiRequest, NextApiResponse } from "next";
import { readFile, renameFile } from "../fs/file";
import { cookieValidations } from "../validation/cookieValidations";
import { getLastUrlPart } from "../data/links";



type ProcessedFiles = Array<[string, File]>
type responseType = {
    status: string
    message: string
    data: string[] | null | any
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
    },

    rename: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200,
        resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        
        const { newName, currentLocation } = JSON.parse(req.body)
        const name = getLastUrlPart(req.url)
       
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })
        
        try {
           await renameFile(currentLocation, name, newName, cookies.data.id)
           resultBody.data = { name, newName, currentLocation}
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        } 
        res.status(status).send(resultBody)
    }
}