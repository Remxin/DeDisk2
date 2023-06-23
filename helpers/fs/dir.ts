import path from "path"
import fs from "fs"
import { AleradyExistError } from "./errors"



export function createUserHomeDir(userId: string) {
    return new Promise((resolve, reject) => {
        try {
            const dirPath = path.join("serverFiles", "folders", userId)
            if (fs.existsSync(dirPath)) throw new Error("This folder already exist")

            fs.mkdirSync(dirPath)
            resolve(dirPath)
        } catch (err) {
            throw new Error("Unexpected server error")
        }
    })
}

export function createUserDir(userId: string, pathName: string) {
    return new Promise((resolve, reject) => {
        try {
            const dirPath = path.join("serverFiles", "folders", userId, pathName)
            const exist = fs.existsSync(dirPath)
            if (exist) throw new AleradyExistError("This folder already exist")
          
            fs.mkdirSync(dirPath)
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
            })

            resolve(returnFiles)
        });
    })
}