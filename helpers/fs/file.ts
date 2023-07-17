import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs"

export function readFile(req: NextApiRequest, saveLocally: boolean, userId: string) {
    const options: formidable.Options = {}

    if (saveLocally) {
        options.uploadDir = path.join('serverFiles', "folders", userId, ".__temp__")
        options.filename = (name, ext, path, form) => {
            return path.originalFilename + ""
        }
    }
    
    const form = formidable(options)
    
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) return reject(err)
            const newFolder = JSON.parse(fields.jsondata[0]).folder
          
        
            for (let i = 0; i < Object.keys(files).length; i++) {
                // @ts-ignore
                const fileData = files['File' + i][0]
                const fileName = fileData.newFilename
                const currentPath = path.join('serverFiles', "folders", userId, ".__temp__", fileName)
                const newPath = path.join('serverFiles', "folders", userId, newFolder, fileName)
                await moveFile(currentPath, newPath)
            }
            
            resolve({ fields, files })
        })
    })
}

export function moveFile(filePath: string, newFilePath: string) {
    return new Promise((resolve, reject) => {
        fs.rename(filePath, newFilePath, function (err) {
            if (err) return reject(err)
            resolve({ message: 'success'})
        })
    })
}

export function renameFile(location: string, name: string, newName: string, userId: string) {

    const originalPath = path.join("serverFiles", "folders", userId, name)
    const newPath = path.join("serverFiles", "folders", userId, newName)
    console.log(originalPath, newPath)

    return new Promise((resolve, reject) => {
               
        try {
            fs.rename(originalPath, newPath, (err) => {
                if (err) return reject(err)
                resolve({ message: "success" })
            })
        } catch (err) {
            reject({ err })
        }
    })
}