import path from "path"
import fs from "fs"

export function createUserHomeDir(userId: string) {
    return new Promise((resolve, reject) => {
        try {
            const dirPath = path.join("public", "folders", userId)
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
            const dirPath = path.join("public", "folders", userId, pathName)
            if (fs.existsSync(dirPath)) throw new Error("This folder already exist")

            fs.mkdirSync(dirPath)
            resolve(dirPath)
        } catch (err) {
            throw new Error("Unexpected server error")
        }
    })
}