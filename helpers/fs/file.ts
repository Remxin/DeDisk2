import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs"

export function readFile(req: NextApiRequest, saveLocally: boolean, userId: string) {
    const options: formidable.Options = {}

    if (saveLocally) {
        options.uploadDir = path.join('serverFiles', "folders", userId)
        options.filename = (name, ext, path, form) => {
            return path.originalFilename + ""
        }
    }
    
    const form = formidable(options)
    
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            console.log(fields, err, files)
            // @ts-ignore
            // options.uploadDir = path.join('serverFiles', "folders", userId, JSON.parse(fields.jsondata[0]).folder)
            // @ts-ignore
            // console.log(JSON.parse(fields.jsondata[0]).folder)
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
}

export function moveFile(filePath: string, newFolderPath: string) {
    const fileName = filePath.split('/').pop()
    return new Promise((resolve, reject) => {
        fs.rename(filePath, newFolderPath + fileName, function (err) {
            if (err) return reject(err)
            resolve({ message: 'success'})
        })
    })
}