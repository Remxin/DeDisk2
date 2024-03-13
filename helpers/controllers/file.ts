import { NextApiRequest, NextApiResponse } from "next";
import { readFile, renameFile, deleteFile, getFileInfo, addToFavourites, removeFromFavourites, getFavourites } from "../fs/file";
import { cookieValidations } from "../validation/cookieValidations";
import { getLastUrlPart, getUrlPartFromEnd } from "../data/links";
import prisma from "@/lib/prisma";
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";



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
    },

    delete: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200,
        resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        
        const replacedPath = getLastUrlPart(req.url)
        
        
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })
        
        try {
            await deleteFile(replacedPath, cookies.data.id)
            const name = replacedPath.split("|").pop()?.replaceAll("%20", " ")!
            resultBody.data = name

        } catch (err) {

            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        } 
        res.status(status).send(resultBody)
    },

    getFileInfo: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200,
        resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        
        const replacedPath = getUrlPartFromEnd(req.url, 2)
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })
        
        try {
            const info = await getFileInfo(replacedPath, cookies.data.id)

            resultBody.data = info

        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        } 
        res.status(status).send(resultBody)
    },

    getFile: async(req: NextApiRequest, res: NextApiResponse) => {
        const filePath = req.query.url as string 
        if (!filePath) return res.status(404).send({ err: "File does not exist"})
        try {
            const userId = cookieValidations.verifyUser(req).data?.id
            if (!userId) return res.status(403).send({ err: "User not authenticated"})
            req.headers["content-type"] = "image/jpg"
            const file = fs.readFileSync(path.join("serverFiles", "folders", userId ,...filePath.split("/")))
            return res.status(200).send(file)

        } catch (err) {
            return res.status(400).send({ err: "File does not exist"})
        }
    },

    getFavourites: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200
        let resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })

       
        try {
         const favs = await getFavourites(cookies.data.id)
       
         // @ts-ignore
         resultBody.data = favs.data 
           
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        }

        res.status(status).send(resultBody)
    },

    addToFavourites: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200
        let resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })

        const { path, fileName, type } = JSON.parse(req.body)
        try {
         
            await addToFavourites(path, cookies.data.id, fileName, type)
            resultBody.data = fileName
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        }

        res.status(status).send(resultBody)
    },

    removeFromFavourites: async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.url) return res.status(404).send({ status: "fail", message: "Wrong url", data: null })
        let status = 200
        let resultBody = { status: "ok", message: "Files were uploaded successfully", data: null} as responseType
        const cookies = cookieValidations.verifyUser(req)
        if (cookies.error) return res.status(401).send({ error: cookies.error.user })

        try {
            await removeFromFavourites(req.body.fileName, cookies.data.id, req.body.path)
            resultBody.data = req.body.path
        } catch (err) {
            status = 500
            resultBody = { status: "fail", message: "Something went wrong", data: null}
        }

        res.status(status).send(resultBody)
    }
}