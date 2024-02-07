import path from "path"
import fs from "fs"
import fsPromise from 'fs/promises'

// errors
import { AleradyExistError } from "./errors"

import { generate as generateIdenticon } from "identicon-generator"
import { error } from "console"



export function createUserHomeDir(userId: string, name: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const dirPath = path.join("serverFiles", "folders", userId)
            if (fs.existsSync(dirPath)) throw new Error("This folder already exist")
            const tempPath = path.join("serverFiles", "folders", userId, ".__temp__")
            const metadataPath = path.join("serverFiles", "folders", userId, ".__metadata__")

            await fsPromise.mkdir(dirPath)
            await fsPromise.mkdir(tempPath)
            await fsPromise.mkdir(metadataPath)

            await createUserAvatar(userId, name)
            resolve(dirPath)
        } catch (err) {
            throw new Error("Unexpected server error")
        }
    })
}



export function createUserDir(userId: string, pathName: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const dirPath = path.join("serverFiles", "folders", userId, pathName)
            const exist = fs.existsSync(dirPath)
            if (exist) throw new AleradyExistError("This folder already exist")
            await fsPromise.mkdir(dirPath)
            
            resolve(dirPath)
        } catch (err) {
            reject(err)
        }
    })
}

export function listDir(userId: string, pathName: string) {
    return new Promise((resolve, reject) => {
        const fullPath = pathName === "dir" ? "" : pathName
        const dirPath = path.join("serverFiles", "folders", userId, fullPath)
        if (!fs.existsSync(dirPath)) return reject({ error: "This directory does not exist"})
        fs.readdir(dirPath, { withFileTypes: true},function (err, files) {
            //handling error
            if (err) {
                return reject({ error: "Cannot list this directory"})
            } 
            //listing all files using forEach
            const returnFiles = files.map((file) => {
                return { name: file.name, type: file.isDirectory() ? "folder": "file"}
            }).filter((e) =>  !/^\./g.test(e.name)
            )
            resolve(returnFiles)
        });
    })
}

export function createUserAvatar(userId: string, name: string) {
    const size = 200
    return new Promise(async (resolve, reject) => {
        try {
            const data = { name }
            const identiconBuffer = await generateIdenticon(data, { size })
            const iconPath = path.join("serverFiles", "folders", userId, ".__metadata__", "icon.png")
            fs.writeFileSync(iconPath, identiconBuffer)
            resolve({ msg: "success"})
        } catch (err) {
            reject({ err })
        }
    })
}