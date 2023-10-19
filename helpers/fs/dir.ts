import path from "path"
import fs from "fs"
import fsPromise from 'fs/promises'
import { AleradyExistError } from "./errors"



export function createUserHomeDir(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const dirPath = path.join("serverFiles", "folders", userId)
            if (fs.existsSync(dirPath)) throw new Error("This folder already exist")
            const tempPath = path.join("serverFiles", "folders", userId, ".__temp__")
            
            await fsPromise.mkdir(dirPath)
            console.log(tempPath)
            await fsPromise.mkdir(tempPath)
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
            }).filter((e) => e.name !== ".__temp__")

            

            resolve(returnFiles)
        });
    })
}