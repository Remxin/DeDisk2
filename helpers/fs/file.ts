import { NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs"
import prisma from "@/lib/prisma";

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

export function deleteFile(absolutePath: string, userId: string) {
    absolutePath = absolutePath.replaceAll("%20", " ")
    const pathParts = absolutePath.split("%7C")
    

    const finalPath = path.join("serverFiles", "folders", userId, ...pathParts)
    return new Promise((resolve, reject) => {
        try {
            fs.rmSync(finalPath, { recursive: true, force: true })
            resolve({ message: "success" })
        } catch (err) {
            reject({ err })
        }
    })
}

export function getFileInfo(absolutePath: string, userId: string) {
    absolutePath = absolutePath.replaceAll("%20", " ")
    const pathParts = absolutePath.split("%7C")
    const fileName = pathParts.pop()!

    const finalPath = path.join("serverFiles", "folders", userId, ...pathParts, fileName)
    return new Promise((resolve, reject) => {
        try {
            const extension = path.extname(finalPath)
            let data = { ...fs.statSync(finalPath), name: fileName, extension }
        
            resolve(data)
        } catch (err) {
            reject({ err })
        }
    })
}

export function getFavourites(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const favs = await prisma.favourite.findMany({ where: { userId }})
            resolve({ data: favs })
        } catch (err) {
            reject({ err })
        }

    })
}

export function addToFavourites(path: string, userId: string, fileName: string, type: string) {
    path = path.replaceAll("%20", " ")
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.favourite.create({ data: { name: fileName, path, userId, type }})
            resolve({ message: "success" })
        } catch (err) {
            reject({ err })
        }
    })
}

export function removeFromFavourites(fileName: string, userId: string, path: string) {
    return new Promise(async (resolve, reject) => {
        try {
            await prisma.favourite.deleteMany({ where: { name: fileName, userId, path }})
            resolve({ message: "success" })
        } catch(err) {
            reject({ err })
        }
    }) 
}
